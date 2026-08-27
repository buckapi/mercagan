import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { BRANCHES, Branch } from '../models/branch.model';

@Injectable({ providedIn: 'root' })
export class BranchService {
  readonly branches = BRANCHES;
  private readonly storageKey = 'mercagan-selected-branch';
  private readonly storage = inject(DOCUMENT).defaultView?.localStorage;
  private readonly storedBranchId = this.readStoredBranchId();
  readonly isOpen = signal(false);
  readonly showDetails = signal(false);
  readonly selectedBranch = signal<Branch>(this.branchFor(this.storedBranchId) ?? BRANCHES[0]);
  readonly hasSelectedBranch = signal(this.storedBranchId !== null);
  readonly locationModalRequest = signal(0);
  private suppressNextLocationModal = false;

  select(branch: Branch): void {
    this.selectedBranch.set(branch);
    this.hasSelectedBranch.set(true);
    this.storage?.setItem(this.storageKey, branch.id);
  }

  selectAndShowDetails(branch: Branch): void {
    this.select(branch);
    this.showDetails.set(true);
  }

  selectAndOpen(id: string): void {
    const branch = this.branches.find((item) => item.id === id);
    if (branch) {
      this.select(branch);
      this.isOpen.set(true);
      this.showDetails.set(true);
    }
  }

  open(): void {
    this.showDetails.set(false);
    this.isOpen.set(true);
  }

  showAll(): void { this.showDetails.set(false); }
  close(): void { this.isOpen.set(false); }

  skipNextLocationModal(): void { this.suppressNextLocationModal = true; }

  consumeLocationModalSuppression(): boolean {
    const shouldSuppress = this.suppressNextLocationModal;
    this.suppressNextLocationModal = false;
    return shouldSuppress;
  }

  requestLocationModal(): void {
    this.locationModalRequest.update((request) => request + 1);
  }

  private branchFor(id: string | null): Branch | undefined {
    return this.branches.find((branch) => branch.id === id);
  }

  private readStoredBranchId(): string | null {
    const id = this.storage?.getItem(this.storageKey) ?? null;
    return this.branchFor(id) ? id : null;
  }
}
