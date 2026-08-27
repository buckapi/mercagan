import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { formatCop, MenuProduct } from '../../models/menu.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly formatCop = formatCop;
  readonly branchService = inject(BranchService);
  readonly branchGroups = this.branchService.branchGroups;
  readonly cartService = inject(CartService);
  readonly searchService = inject(SearchService);
  private readonly router = inject(Router);
  readonly mobileMenuOpen = signal(false);
  readonly phoneDirectoryOpen = signal(false);

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

  openPhoneDirectory(): void {
    if (!this.branchService.hasSelectedBranch()) {
      this.router.navigate(['/menu']);
      this.branchService.requestLocationModal();
      return;
    }
    this.phoneDirectoryOpen.update((open) => !open);
  }

  openSearch(): void {
    this.searchService.open();
  }

  removeFromCart(product: MenuProduct): void {
    const item = this.cartService.items().find((cartItem) => cartItem.product.id === product.id);
    if (item) this.cartService.change(product, -item.quantity);
  }
}
