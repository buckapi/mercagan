import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatCop, MenuProduct } from '../../models/menu.model';
import productsData from '../../data/menu-products.json';
import { BranchService } from '../../services/branch.service';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.css',
})
export class SearchModalComponent {
  readonly searchService = inject(SearchService);
  readonly branchService = inject(BranchService);
  readonly cartService = inject(CartService);
  readonly formatCop = formatCop;
  readonly query = signal('');
  readonly searchAllBranches = signal(false);
  private readonly products = productsData as readonly MenuProduct[];
  readonly results = computed(() => {
    const query = this.normalize(this.query());
    if (!query) return [];
    return this.products
      .filter((product) => product.active && (this.searchAllBranches() || product.branchId === this.branchService.selectedBranch().id))
      .filter((product) => this.normalize(`${product.name} ${product.shortDescription}`).includes(query))
      .slice(0, 6);
  });
  readonly productQuantities = computed(() =>
    Object.fromEntries(this.cartService.items().map((item) => [item.product.id, item.quantity])),
  );

  updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  toggleSearchScope(event: Event): void {
    this.searchAllBranches.set((event.target as HTMLInputElement).checked);
  }

  branchName(branchId: string): string {
    return this.branchService.branches.find((branch) => branch.id === branchId)?.name ?? 'Sede no disponible';
  }

  close(): void {
    this.searchService.close();
    this.query.set('');
  }

  addToCart(product: MenuProduct): void {
    this.cartService.add(product);
  }

  changeQuantity(product: MenuProduct, delta: number): void {
    this.cartService.change(product, delta);
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }
}
