import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Branch } from '../../models/branch.model';
import { BranchService } from '../../services/branch.service';
import { CartService } from '../../services/cart.service';
import { MenuCategory, MenuProduct } from '../../models/menu.model';
import categoriesData from '../../data/menu-categories.json';
import productsData from '../../data/menu-products.json';

@Component({
  selector: 'app-menu-shop',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './menu-shop.component.html',
  styleUrl: './menu-shop.component.css',
})
export class MenuShopComponent {
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
  readonly branchGroups: readonly Branch['group'][] = ['Bucaramanga y Santander', 'Bogotá'];
  readonly activeBranchGroup = signal<Branch['group']>(this.branchService.selectedBranch().group);
  readonly quickViewProduct = signal<MenuProduct | null>(null);
  readonly productQuantities = signal<Record<string, number>>({});
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

  private readonly branchCoordinates: Readonly<Record<string, { latitude: number; longitude: number }>> = {
    'carrera-33': { latitude: 7.1267, longitude: -73.1174 },
    'san-pio': { latitude: 7.1165, longitude: -73.1082 },
    'cc-megamall': { latitude: 7.1324, longitude: -73.1124 },
    'cabecera-cuarta-etapa': { latitude: 7.1191, longitude: -73.1098 },
    'cc-cacique': { latitude: 7.0996, longitude: -73.1063 },
    'canaveral-carrera-26': { latitude: 7.0687, longitude: -73.1058 },
    'cc-canaveral-express': { latitude: 7.0674, longitude: -73.1051 },
    'cc-de-la-cuesta': { latitude: 7.0718, longitude: -73.1158 },
    'cc-acropolis': { latitude: 7.1148, longitude: -73.1269 },
    'cc-el-puente-san-gil': { latitude: 6.5558, longitude: -73.1331 },
    'cc-el-eden': { latitude: 4.6534, longitude: -74.1328 },
    'pepe-sierra': { latitude: 4.6968, longitude: -74.0437 },
    'zona-g': { latitude: 4.6505, longitude: -74.0570 },
  };

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
    this.productQuantities.update((quantities) => ({
      ...quantities,
      [product.id]: Math.max(1, quantities[product.id] ?? 0),
    }));
  }

  changeQuantity(product: MenuProduct, delta: number): void {
    this.cartService.change(product, delta);
    this.productQuantities.update((quantities) => {
      const nextQuantity = Math.max(0, (quantities[product.id] ?? 0) + delta);
      const nextQuantities = { ...quantities };
      if (nextQuantity === 0) {
        delete nextQuantities[product.id];
      } else {
        nextQuantities[product.id] = nextQuantity;
      }
      return nextQuantities;
    });
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

  branchesFor(group: Branch['group']): readonly Branch[] {
    return this.branchService.branches.filter((branch) => branch.group === group);
  }

  openLocationModal(): void {
    const selectedBranch = this.branchService.selectedBranch();
    this.candidateBranchId.set(selectedBranch.id);
    this.activeBranchGroup.set(selectedBranch.group);
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

  selectBranchGroup(group: Branch['group']): void {
    this.activeBranchGroup.set(group);
    const currentCandidate = this.branchService.branches.find((branch) => branch.id === this.candidateBranchId());

    if (currentCandidate?.group !== group) {
      const firstBranch = this.branchesFor(group)[0];
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
        this.activeBranchGroup.set(nearest.group);
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
    return this.branchService.branches.reduce((nearest, branch) => {
      const nearestDistance = this.distanceTo(latitude, longitude, nearest.id);
      const branchDistance = this.distanceTo(latitude, longitude, branch.id);
      return branchDistance < nearestDistance ? branch : nearest;
    });
  }

  private distanceTo(latitude: number, longitude: number, branchId: string): number {
    const target = this.branchCoordinates[branchId];
    const latDifference = latitude - target.latitude;
    const longitudeDifference = (longitude - target.longitude) * Math.cos(latitude * Math.PI / 180);
    return latDifference ** 2 + longitudeDifference ** 2;
  }
}
