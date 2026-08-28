import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly branchService = inject(BranchService);
}
