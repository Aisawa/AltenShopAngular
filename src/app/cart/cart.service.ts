import { Injectable, signal } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<Product[]>([]);

  get items() {
    return this.cartItems.asReadonly();
  }

  addToCart(product: Product) {
    this.cartItems.update(items => [...items, product]);
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}