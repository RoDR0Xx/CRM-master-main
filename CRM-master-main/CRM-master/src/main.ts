import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { Component, OnInit } from '@angular/core';

interface Cap {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-tienda-gorras',
  templateUrl: 'index.html',
  styleUrls: ['styles.css']
})
export class TiendaGorrasComponent implements OnInit {

  caps: Cap[] = [];
  cart: Cap[] = [];

  ngOnInit(): void {
    this.loadCaps();
    this.loadCart();
  }

  loadCaps() {
    this.caps = [
      { id: 1, name: 'Gorra Negra', price: 20, image: 'assets/gorra-negra.jpg' },
      { id: 2, name: 'Gorra Roja', price: 22, image: 'assets/gorra-roja.jpg' },
      { id: 3, name: 'Gorra Azul', price: 18, image: 'assets/gorra-azul.jpg' }
    ];
  }

  loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) this.cart = JSON.parse(stored);
  }

  addToCart(cap: Cap) {
    this.cart.push(cap);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }
}