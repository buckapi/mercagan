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
  readonly branchGroups: readonly Branch['group'][] = ['Bucaramanga y Santander', 'Bogotá'];
  readonly activeBranchGroup = signal<Branch['group']>('Bucaramanga y Santander');

  branchesFor(group: Branch['group']): readonly Branch[] {
    return this.branchService.branches.filter((branch) => branch.group === group);
  }

  selectBranchGroup(group: Branch['group']): void {
    this.activeBranchGroup.set(group);
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
