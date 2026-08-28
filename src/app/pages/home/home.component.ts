import { DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly document = inject(DOCUMENT);
  private readonly branchService = inject(BranchService);
  readonly b2bModalOpen = signal(false);
  readonly b2bBranches = this.branchService.branches.filter((branch) => branch.whatsApp);
  readonly selectedB2bBranchId = signal(this.b2bBranches[0]?.id ?? '');
  readonly menuHighlights = [
    { name: 'Lomito fino', description: 'Uno de los cortes presentes en la carta pública de Mercagán.', image: 'assets/img/dishes/dishes2_1.png', delay: '0.2s' },
    { name: 'Carne oreada', description: 'Preparación vinculada a la tradición gastronómica de Santander.', image: 'assets/img/dishes/dishes2_2.png', delay: '0.3s' },
    { name: 'Chatas', description: 'Corte disponible en distintas preparaciones de la carta.', image: 'assets/img/dishes/dishes2_3.png', delay: '0.4s' },
    { name: 'Pincho mixto', description: 'Preparación de lomito fino y pollo.', image: 'assets/img/dishes/dishes2_4.png', delay: '0.5s' },
    { name: 'Hamburguesa tradicional', description: 'Una de las especialidades reconocidas de Mercagán.', image: 'assets/img/dishes/dishes2_5.png', delay: '0.6s' },
    { name: 'Hamburguesa mexicana', description: 'Opción incluida en la carta pública consultada.', image: 'assets/img/dishes/dishes2_1.png', delay: '0.7s' },
  ] as const;

  openB2bModal(): void {
    this.b2bModalOpen.set(true);
  }

  closeB2bModal(): void {
    this.b2bModalOpen.set(false);
  }

  selectB2bBranch(id: string): void {
    this.selectedB2bBranchId.set(id);
  }

  @HostListener('document:keydown.escape')
  closeB2bModalWithEscape(): void {
    this.closeB2bModal();
  }

  submitB2b(event: Event): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const branch = this.b2bBranches.find((item) => item.id === this.selectedB2bBranchId());

    if (!branch?.whatsApp) return;

    const message = [
      'Hola, quiero solicitar información comercial para mi negocio.',
      `Sede elegida: ${branch.name}`,
      `Nombre: ${data.get('name')}`,
      `Negocio: ${data.get('business')}`,
      `Teléfono: ${data.get('phone')}`,
      `Ciudad: ${data.get('city')}`,
      `Compra estimada: ${data.get('volume')}`,
      data.get('details') ? `Información adicional: ${data.get('details')}` : '',
    ].filter(Boolean).join('\n');
    const url = `https://wa.me/57${branch.whatsApp.value}?text=${encodeURIComponent(message)}`;

    this.document.defaultView?.open(url, '_blank', 'noopener,noreferrer');
    this.closeB2bModal();
  }
}
