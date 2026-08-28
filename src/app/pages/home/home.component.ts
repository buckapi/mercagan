import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BranchService } from '../../services/branch.service';

interface BannerSwiper {
  destroy(deleteInstance?: boolean, cleanStyles?: boolean): void;
}

declare const Swiper: new (element: Element, options: object) => BannerSwiper;

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly branchService = inject(BranchService);
  readonly bannerSlider = viewChild<ElementRef<HTMLElement>>('bannerSlider');
  readonly b2bModalOpen = signal(false);
  readonly b2bDepartments = this.branchService.departments;
  readonly selectedB2bDepartment = signal(this.b2bDepartments[0]?.name ?? '');
  readonly b2bBranches = computed(() =>
    this.branchService.branches.filter((branch) => branch.department === this.selectedB2bDepartment() && branch.primaryPhone.isMobile),
  );
  readonly selectedB2bBranchId = signal(this.b2bBranches()[0]?.id ?? '');
  readonly selectedB2bVolume = signal('Compra ocasional');
  readonly menuHighlights = [
    { name: 'Lomito fino', description: 'Uno de los cortes presentes en la carta pública de Mercagán.', image: 'assets/img/dishes/dishes2_1.png', delay: '0.2s' },
    { name: 'Carne oreada', description: 'Preparación vinculada a la tradición gastronómica de Santander.', image: 'assets/img/dishes/dishes2_2.png', delay: '0.3s' },
    { name: 'Chatas', description: 'Corte disponible en distintas preparaciones de la carta.', image: 'assets/img/dishes/dishes2_3.png', delay: '0.4s' },
    { name: 'Pincho mixto', description: 'Preparación de lomito fino y pollo.', image: 'assets/img/dishes/dishes2_4.png', delay: '0.5s' },
    { name: 'Hamburguesa tradicional', description: 'Una de las especialidades reconocidas de Mercagán.', image: 'assets/img/dishes/dishes2_5.png', delay: '0.6s' },
    { name: 'Hamburguesa mexicana', description: 'Opción incluida en la carta pública consultada.', image: 'assets/img/dishes/dishes2_1.png', delay: '0.7s' },
  ] as const;
  private bannerSwiper?: BannerSwiper;

  ngAfterViewInit(): void {
    const slider = this.bannerSlider()?.nativeElement;
    if (!slider || typeof Swiper === 'undefined') return;

    this.bannerSwiper = new Swiper(slider, {
      loop: true,
      slidesPerView: 1,
      effect: 'fade',
      speed: 4000,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: slider.querySelector('.arrow-next2'),
        prevEl: slider.querySelector('.arrow-prev2'),
      },
      pagination: {
        el: slider.querySelector('.pagination-class2'),
        clickable: true,
      },
    });
  }

  ngOnDestroy(): void {
    this.bannerSwiper?.destroy(true, true);
  }

  openB2bModal(): void {
    this.b2bModalOpen.set(true);
  }

  closeB2bModal(): void {
    this.b2bModalOpen.set(false);
  }

  selectB2bBranch(id: string): void {
    this.selectedB2bBranchId.set(id);
  }

  selectB2bDepartment(department: string): void {
    this.selectedB2bDepartment.set(department);
    this.selectedB2bBranchId.set(this.b2bBranches()[0]?.id ?? '');
  }

  selectB2bVolume(volume: string): void {
    this.selectedB2bVolume.set(volume);
  }

  @HostListener('document:keydown.escape')
  closeB2bModalWithEscape(): void {
    this.closeB2bModal();
  }

  submitB2b(event: Event): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const branch = this.b2bBranches().find((item) => item.id === this.selectedB2bBranchId());

    const phone = branch?.whatsApp ?? branch?.primaryPhone;
    if (!branch || !phone) return;

    const message = [
      'Hola, quiero solicitar información comercial para mi negocio.',
      `Sede elegida: ${branch.name}`,
      `Nombre: ${data.get('name')}`,
      `Negocio: ${data.get('business')}`,
      `Teléfono: ${data.get('phone')}`,
      `Ciudad: ${data.get('city')}`,
      `Compra estimada: ${this.selectedB2bVolume()}`,
      data.get('details') ? `Información adicional: ${data.get('details')}` : '',
    ].filter(Boolean).join('\n');
    const url = `https://wa.me/57${phone.value}?text=${encodeURIComponent(message)}`;

    this.document.defaultView?.open(url, '_blank', 'noopener,noreferrer');
    this.closeB2bModal();
  }
}
