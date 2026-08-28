import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Branch } from '../../models/branch.model';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly branchService = inject(BranchService);
  private readonly document = inject(DOCUMENT);
  readonly departments = this.branchService.departments;
  readonly activeDepartment = signal(this.branchService.selectedBranch().department);

  selectDepartment(department: string): void {
    this.activeDepartment.set(department);
  }

  selectBranch(branch: Branch): void {
    this.branchService.select(branch);
  }

  showBranchDetails(branch: Branch): void {
    const isDesktop = this.document.defaultView?.matchMedia('(min-width: 1200px)').matches ?? false;
    if (isDesktop) {
      this.branchService.select(branch);
      this.branchService.close();
      return;
    }
    this.branchService.selectAndShowDetails(branch);
  }
}
