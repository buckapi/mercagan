import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { CartService } from '../../services/cart.service';
import { MenuProduct } from '../../models/menu.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly branchService = inject(BranchService);
  readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  openLocationSelector(): void {
    if (this.router.url.startsWith('/menu')) {
      this.branchService.requestLocationModal();
      return;
    }
    this.branchService.open();
  }

  removeFromCart(product: MenuProduct): void {
    const item = this.cartService.items().find((cartItem) => cartItem.product.id === product.id);
    if (item) this.cartService.change(product, -item.quantity);
  }
}
