import { Injectable, signal, computed, effect } from '@angular/core';
import { Game } from './game';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<Game[]>([]);

  cart = computed(() => this.cartItems());

  totalItems = computed(() => this.cartItems().length);

  totalPrice = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + Number(item.price), 0);
  });

  constructor() {
    effect(() => {
      const items = this.cartItems();
      localStorage.setItem('cart_items', JSON.stringify(items));
      console.log(`[Cart State] Updated: ${items.length} items logged.`);
    });

    const saved = localStorage.getItem('cart_items');
    if (saved) {
      try {
        this.cartItems.set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved cart items', e);
      }
    }
  }

  addToCart(game: Game): void {
    this.cartItems.update(items => [...items, game]);
  }

  removeFromCart(gameId: number): void {
    this.cartItems.update(items => items.filter(item => item.id !== gameId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
