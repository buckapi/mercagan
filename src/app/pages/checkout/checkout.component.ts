import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatCop } from '../../models/menu.model';
import { BranchService } from '../../services/branch.service';
import { CartService } from '../../services/cart.service';

@Component({ selector: 'app-checkout', standalone: true, imports: [RouterLink], templateUrl: './checkout.component.html', styleUrl: './checkout.component.css' })
export class CheckoutComponent {
  readonly formatCop = formatCop;
  readonly cartService = inject(CartService);
  readonly branchService = inject(BranchService);
  readonly orderSubmitted = signal(false);

  submitOrder(event: SubmitEvent): void {
    event.preventDefault();
    this.orderSubmitted.set(true);
  }
}
