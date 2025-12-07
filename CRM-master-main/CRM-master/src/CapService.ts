import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // <-- ¡NUEVO!

// La URL base de tu API Java (debe ser el puerto 8080 y la ruta que usa tu controlador)
const API_URL = 'http://localhost:8080/api/gorras'; // <-- ¡NUEVA CONSTANTE!

/** Definición de interfaces */
export interface Cap {
    id: string;
    name: string;
    price: number;
    type: 'planas' | 'normales' | 'clasicas' | 'vintage';
    typeName: string;
    color: string;
    colorName: string;
    description: string;
    emoji: string;
    badge?: string;
}

export interface CartItem {
    productId: string;
    qty: number;
    price: number;
}

// --- Datos Fijos del Catálogo (Se mantienen para lógica de UI/Carrito) ---
const CATEGORIES = {
    planas: { name: 'Planas', price: 25.00, emoji: '😎' },
    normales: { name: 'Normales', price: 30.00, emoji: '🧢' },
    clasicas: { name: 'Clásicas', price: 40.00, emoji: '🎩' },
    vintage: { name: 'Vintage', price: 50.00, emoji: '🪖' }
} as const;

const COLORS = ['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde', 'Amarillo'];
const LS_CART_KEY = 'tienda_gorras_cart_v2';

@Injectable({
    providedIn: 'root',
})
export class CapService {
    
    // Almacenamiento local para no hacer múltiples llamadas
    private _products: Cap[] = [];
    private _cart$ = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());
    public readonly cart$: Observable<CartItem[]> = this._cart$.asObservable();

    // INYECCIÓN DE HTTP CLIENT
    constructor(private http: HttpClient) {} 

    // --- MÉTODOS DE DATOS ---

    // Este método AHORA devuelve un Observable y hace la llamada HTTP.
    // Retorna los productos de la API, o los productos en memoria si ya se cargaron.
    getAllCaps(): Observable<Cap[]> { 
        if (this._products.length > 0) {
            // Si ya cargamos los productos, los devolvemos como un Observable síncrono
            return of(this._products);
        }

        // Si no están cargados, hacemos la petición HTTP
        return this.http.get<Cap[]>(API_URL)
            .pipe(
                tap(products => {
                    // Guardamos los productos en memoria después de la llamada exitosa
                    this._products = products; 
                })
            );
    }

    // Los demás métodos que dependen de _products (como getCapById) seguirán funcionando
    // siempre que el componente llame primero a getAllCaps() y espere su resultado.
    getCapById(id: string): Cap | undefined { return this._products.find(p => p.id === id); }

    getCapTypes(): { key: Cap['type'], name: string }[] {
        return Object.entries(CATEGORIES).map(([key, value]) => ({ key: key as Cap['type'], name: value.name }));
    }

    // --- ELIMINAR ESTA FUNCIÓN COMPLETA ---
    // private generateProducts(): Cap[] { ... } 
    // Ya no es necesaria, el código de arriba la reemplaza.
    
    // --- MÉTODOS DEL CARRITO (SIN CAMBIOS) ---
    private loadCartFromStorage(): CartItem[] {
        try {
            const raw = localStorage.getItem(LS_CART_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    private saveCart(cart: CartItem[]): void {
        localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
        this._cart$.next(cart);
    }

    addToCart(productId: string, qty: number = 1): void {
        const product = this.getCapById(productId);
        if (!product) return;
        const currentCart = this._cart$.getValue();
        const existingItem = currentCart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            currentCart.push({ productId, qty, price: product.price });
        }
        this.saveCart(currentCart);
    }
    
    updateCartItemQty(productId: string, delta: number): void {
        let currentCart = this._cart$.getValue();
        const item = currentCart.find(i => i.productId === productId);
        
        if (!item) return;
        item.qty += delta;

        if (item.qty <= 0) {
            currentCart = currentCart.filter(i => i.productId !== productId);
        }
        this.saveCart(currentCart);
    }

    getCartTotal(cart: CartItem[]): number {
        return cart.reduce((total, item) => total + item.price * item.qty, 0);
    }

    getCartItemsCount(cart: CartItem[]): number {
        return cart.reduce((total, item) => total + item.qty, 0);
    }

    clearCart(): void {
        this.saveCart([]);
    }
}