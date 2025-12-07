import { Component, OnInit } from '@angular/core';
import { Cap, CapService, CartItem } from './CapService'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs'; // Necesario para manejar el error

@Component({
  selector: 'app-tienda-gorras',
  templateUrl: 'index.html',
  styleUrls: ['styles.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  providers: [CapService] 
})
export class TiendaGorrasComponent implements OnInit {

  caps: Cap[] = [];
  capsFiltered: Cap[] = [];
  capTypes: { key: Cap['type'], name: string }[] = [];
  
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  cartCount: number = 0;

  searchTerm: string = '';
  filterByType: string = '';
  
  // Variable para controlar el mensaje de error en la UI (lo que ya te salía en la imagen)
  errorConexionAPI: boolean = false; 

  constructor(private capService: CapService) {}

  ngOnInit(): void {
    // 1. LLAMADA ASÍNCRONA A LA API
    this.capService.getAllCaps()
      .pipe(
        catchError(error => {
          // Si hay un error HTTP, establece la bandera de error
          console.error('Error al conectar con la API:', error);
          this.errorConexionAPI = true; 
          return EMPTY; // Detiene la ejecución del subscribe
        })
      )
      .subscribe(productos => {
        // --- ESTO SÓLO SE EJECUTA SI LA LLAMADA A LA API FUE EXITOSA ---
        
        // 2. Asignar los datos del API
        this.caps = productos;
        
        // 3. Inicializar tipos de gorra y aplicar filtros con los datos cargados
        this.capTypes = this.capService.getCapTypes();
        this.applyFilters(); 
        
        // 4. Si la API se conectó pero devolvió 0 productos, mostrara "No se han encontrado productos"
        if (this.caps.length === 0) {
            console.log("API conectada, pero no devolvió productos.");
        }
      });

    // 5. Suscripción al estado reactivo del carrito (esto estaba bien y no necesita esperar a la API)
    this.capService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.cartTotal = this.capService.getCartTotal(cart);
      this.cartCount = this.capService.getCartItemsCount(cart);
    });
  }

  // --- Métodos de Interacción del Componente (sin cambios) ---

  addToCart(id: string): void {
    this.capService.addToCart(id, 1);
  }
  
  updateQty(id: string, delta: number): void {
      this.capService.updateCartItemQty(id, delta);
  }

  checkout(): void {
    if (confirm(`Total a pagar: $${this.cartTotal.toFixed(2)}. ¿Confirmar pago?`)) {
      this.capService.clearCart();
      alert('Pago simulado — Carrito vaciado.');
    }
  }

  getProductName(id: string): string {
      return this.capService.getCapById(id)?.name || 'Producto Desconocido';
  }

  // --- Lógica de Filtros (sin cambios) ---

  onFilterTypeChange(target: any): void {
      this.filterByType = target.value;
      this.applyFilters();
  }

  applyFilters(): void {
      let filtered = this.caps.slice();

      if (this.filterByType) {
          filtered = filtered.filter(p => p.type === this.filterByType);
      }

      const q = this.searchTerm.toLowerCase();
      if (q) {
          filtered = filtered.filter(p =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
          );
      }

      this.capsFiltered = filtered;
  }
}