import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { BRANCHES, Branch, BranchDepartment, BranchGroup, BranchRegion } from '../models/branch.model';

@Injectable({ providedIn: 'root' })
export class BranchService {
  readonly branches = BRANCHES;
  /** Legacy visual grouping retained for callers that have not migrated yet. */
  readonly branchGroups: readonly BranchGroup[] = ['Bucaramanga y área metropolitana', 'Santander', 'Bogotá'];
  readonly departments = this.createDepartments();
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

  branchesFor(group: BranchGroup): readonly Branch[] {
    return this.branches.filter((branch) => branch.group === group);
  }

  branchesByDepartment(department: string): readonly Branch[] {
    return this.branches.filter((branch) => branch.department === department);
  }

  branchesByRegion(region: string): readonly Branch[] {
    return this.branches.filter((branch) => branch.region === region);
  }

  branchesByCity(city: string): readonly Branch[] {
    return this.branches.filter((branch) => branch.city === city);
  }

  regionsByDepartment(department: string): readonly BranchRegion[] {
    return this.departments.find((item) => item.name === department)?.regions ?? [];
  }

  departmentFor(branch: Branch): BranchDepartment | undefined {
    return this.departments.find((department) => department.name === branch.department);
  }

  private branchFor(id: string | null): Branch | undefined {
    return this.branches.find((branch) => branch.id === id);
  }

  private readStoredBranchId(): string | null {
    const id = this.storage?.getItem(this.storageKey) ?? null;
    return this.branchFor(id) ? id : null;
  }

  private createDepartments(): readonly BranchDepartment[] {
    const departments: Array<{
      name: string;
      navigationName: string;
      regions: Array<{ name: string; navigationName: string; branches: Branch[] }>;
    }> = [];

    for (const branch of this.branches) {
      let department = departments.find((item) => item.name === branch.department);

      if (!department) {
        department = {
          name: branch.department,
          navigationName: branch.department === 'Bogotá D.C.' ? 'Bogotá' : branch.department,
          regions: [],
        };
        departments.push(department);
      }

      let region = department.regions.find((item) => item.name === branch.region);

      if (!region) {
        region = {
          name: branch.region,
          navigationName: branch.region === 'Área Metropolitana de Bucaramanga' ? 'Área Metropolitana' : branch.region,
          branches: [],
        };
        department.regions.push(region);
      }

      region.branches.push(branch);
    }

    return departments;
  }
}
