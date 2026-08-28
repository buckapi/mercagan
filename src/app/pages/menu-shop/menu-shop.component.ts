import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Branch } from '../../models/branch.model';
import { BranchService } from '../../services/branch.service';
import { CartService } from '../../services/cart.service';
import { formatCop, MenuCategory, MenuProduct } from '../../models/menu.model';
import categoriesData from '../../data/menu-categories.json';
import productsData from '../../data/menu-products.json';

@Component({
  selector: 'app-menu-shop',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './menu-shop.component.html',
  styleUrl: './menu-shop.component.css',
})
export class MenuShopComponent {
  readonly formatCop = formatCop;
  readonly branchService = inject(BranchService);
  readonly cartService = inject(CartService);
  readonly categoriesData = categoriesData as readonly MenuCategory[];
  readonly products = productsData as readonly MenuProduct[];
  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly filtersOpen = signal(false);
  readonly desktopFiltersCollapsed = signal(false);
  readonly productView = signal<'grid' | 'list'>('grid');
  readonly ribbonScrolled = signal(false);
  readonly ribbonHidden = signal(false);
  readonly selectedCategory = signal('Todas');
  readonly locationModalOpen = signal(!this.branchService.hasSelectedBranch() && !this.branchService.consumeLocationModalSuppression());
  readonly locating = signal(false);
  readonly locationError = signal('');
  readonly candidateBranchId = signal(this.branchService.selectedBranch().id);
  readonly departments = this.branchService.departments;
  readonly activeDepartment = signal(this.branchService.selectedBranch().department);
  readonly quickViewProduct = signal<MenuProduct | null>(null);
  readonly productQuantities = computed(() =>
    Object.fromEntries(this.cartService.items().map((item) => [item.product.id, item.quantity])),
  );
  private ribbonRevealRequested = false;
  private ribbonRevealScrollY = 0;
  private lastLocationRequest = 0;
  private readonly locationRequestEffect = effect(() => {
    const request = this.branchService.locationModalRequest();
    if (request > this.lastLocationRequest) {
      this.lastLocationRequest = request;
      untracked(() => this.openLocationModal());
    }
  });
  private readonly branchChangeEffect = effect(() => {
    this.branchService.selectedBranch().id;
    untracked(() => this.selectedCategory.set('Todas'));
  });

  toggleFilters(): void { this.filtersOpen.update((open) => !open); }
  closeFilters(): void { this.filtersOpen.set(false); }
  toggleDesktopFilters(): void {
    this.desktopFiltersCollapsed.update((collapsed) => !collapsed);
    this.cdr.detectChanges();
    const window = this.document.defaultView;

    window?.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    window?.setTimeout(() => {
      const maximumScroll = Math.max(0, this.document.documentElement.scrollHeight - window.innerHeight);
      const scrollDelta = window.scrollY + 2 <= maximumScroll ? 2 : -2;
      window.scrollBy({ top: scrollDelta, left: 0, behavior: 'auto' });
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
      this.cdr.detectChanges();
    }, 300);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollY = this.document.defaultView?.scrollY ?? 0;
    this.ribbonScrolled.set(scrollY > 20);
    if (this.ribbonRevealRequested && Math.abs(scrollY - this.ribbonRevealScrollY) <= 2) {
      return;
    }
    if (this.ribbonRevealRequested) {
      this.ribbonRevealRequested = false;
    }
    if (scrollY > 20 && !this.ribbonHidden()) {
      this.ribbonHidden.set(true);
    }
  }

  toggleRibbon(): void {
    const willReveal = this.ribbonHidden();
    this.ribbonHidden.set(!willReveal);
    this.ribbonRevealRequested = willReveal;
    if (willReveal) {
      this.ribbonRevealScrollY = this.document.defaultView?.scrollY ?? 0;
    }
  }

  openQuickView(product: MenuProduct): void {
    this.quickViewProduct.set(product);
  }

  closeQuickView(): void {
    this.quickViewProduct.set(null);
  }

  addToCart(product: MenuProduct): void {
    this.cartService.add(product);
  }

  changeQuantity(product: MenuProduct, delta: number): void {
    this.cartService.change(product, delta);
  }

  visibleProducts(): readonly MenuProduct[] {
    const category = this.selectedCategory();
    const branchId = this.branchService.selectedBranch().id;
    if (category === 'Todas') return this.products.filter((product) => product.active && product.branchId === branchId);
    const categoryRecord = this.availableCategories().find((item) => item.name === category);
    return this.products.filter((product) => product.active && product.branchId === branchId && product.categoryId === categoryRecord?.id);
  }

  categories(): readonly string[] {
    return ['Todas', ...this.availableCategories().map((category) => category.name)];
  }

  availableCategories(): readonly MenuCategory[] {
    const branchId = this.branchService.selectedBranch().id;
    return this.categoriesData
      .filter((category) => category.active && category.branchId === branchId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.quickViewProduct()) this.closeQuickView();
  }

  selectCategory(event: Event): void {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
  }

  openLocationModal(): void {
    const selectedBranch = this.branchService.selectedBranch();
    this.candidateBranchId.set(selectedBranch.id);
    this.activeDepartment.set(selectedBranch.department);
    this.locationError.set('');
    this.locationModalOpen.set(true);
  }

  chooseCandidate(branchId: string): void {
    this.candidateBranchId.set(branchId);
    this.locationError.set('');
    const branch = this.branchService.branches.find((item) => item.id === branchId);
    if (branch) this.branchService.select(branch);
    this.locationModalOpen.set(false);
    this.cdr.detectChanges();
  }

  selectDepartment(department: string): void {
    this.activeDepartment.set(department);
    const currentCandidate = this.branchService.branches.find((branch) => branch.id === this.candidateBranchId());

    if (currentCandidate?.department !== department) {
      const firstBranch = this.branchService.branchesByDepartment(department)[0];
      if (firstBranch) this.candidateBranchId.set(firstBranch.id);
    }
  }

  confirmBranch(): void {
    const branch = this.branchService.branches.find((item) => item.id === this.candidateBranchId());

    if (branch) {
      this.branchService.select(branch);
      this.locationModalOpen.set(false);
    }
  }

  useCurrentLocation(): void {
    const geolocation = this.document.defaultView?.navigator.geolocation;

    if (!geolocation) {
      this.locationError.set('Tu navegador no permite obtener la ubicación. Selecciona una sede manualmente.');
      return;
    }

    this.locating.set(true);
    this.locationError.set('');
    geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = this.findNearestBranch(coords.latitude, coords.longitude);
        this.candidateBranchId.set(nearest.id);
        this.activeDepartment.set(nearest.department);
        this.branchService.select(nearest);
        this.locating.set(false);
        this.locationModalOpen.set(false);
      },
      (error) => {
        const messages: Record<number, string> = {
          1: 'No autorizaste el acceso a tu ubicación. Selecciona una sede manualmente.',
          2: 'No pudimos determinar tu ubicación. Intenta de nuevo o selecciona una sede.',
          3: 'La ubicación tardó demasiado. Intenta de nuevo o selecciona una sede.',
        };
        this.locationError.set(messages[error.code] ?? 'No pudimos obtener tu ubicación.');
        this.locating.set(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  private findNearestBranch(latitude: number, longitude: number): Branch {
    const branchesWithCoordinates = this.branchService.branches.filter((branch) => branch.latitude !== undefined && branch.longitude !== undefined);
    return branchesWithCoordinates.reduce((nearest, branch) => {
      const nearestDistance = this.distanceTo(latitude, longitude, nearest);
      const branchDistance = this.distanceTo(latitude, longitude, branch);
      return branchDistance < nearestDistance ? branch : nearest;
    });
  }

  private distanceTo(latitude: number, longitude: number, branch: Branch): number {
    if (branch.latitude === undefined || branch.longitude === undefined) return Number.POSITIVE_INFINITY;
    const latDifference = latitude - branch.latitude;
    const longitudeDifference = (longitude - branch.longitude) * Math.cos(latitude * Math.PI / 180);
    return latDifference ** 2 + longitudeDifference ** 2;
  }
}
