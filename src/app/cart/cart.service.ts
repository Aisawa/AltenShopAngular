<<<<<<< HEAD
import { computed, Injectable, signal } from '@angular/core';
=======
import { Injectable, signal } from '@angular/core';
>>>>>>> d1bec52109e9a4e212fcc4cd6aa49c479235343c
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
<<<<<<< HEAD

  get total() {
    return computed(() => 
      this.cartItems().reduce((sum, item) => sum + item.price, 0)
    );
  }
=======
>>>>>>> d1bec52109e9a4e212fcc4cd6aa49c479235343c
}