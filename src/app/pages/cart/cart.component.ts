import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatCop, MenuProduct } from '../../models/menu.model';
import { CartService } from '../../services/cart.service';

@Component({ selector: 'app-cart', standalone: true, imports: [RouterLink], templateUrl: './cart.component.html', styleUrl: './cart.component.css' })
export class CartComponent {
  readonly cartService = inject(CartService);
  readonly formatCop = formatCop;

  changeQuantity(product: MenuProduct, delta: number): void {
    this.cartService.change(product, delta);
  }

  remove(product: MenuProduct): void {
    const item = this.cartService.items().find((cartItem) => cartItem.product.id === product.id);
    if (item) this.cartService.change(product, -item.quantity);
  }
}
