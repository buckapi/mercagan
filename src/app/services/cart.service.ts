import { Injectable, computed, signal } from '@angular/core';
import { MenuProduct } from '../models/menu.model';

export interface CartItem { product: MenuProduct; quantity: number; }

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<readonly CartItem[]>([]);
  readonly totalItems = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
  readonly total = computed(() => this.items().reduce((total, item) => total + item.product.price * item.quantity, 0));

  add(product: MenuProduct): void { this.change(product, 1); }
  change(product: MenuProduct, delta: number): void {
    const current = this.items().find((item) => item.product.id === product.id);
    const quantity = Math.max(0, (current?.quantity ?? 0) + delta);
    this.items.set(quantity ? [...this.items().filter((item) => item.product.id !== product.id), { product, quantity }] : this.items().filter((item) => item.product.id !== product.id));
  }
}
