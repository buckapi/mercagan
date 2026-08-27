import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Branch, BranchGroup } from '../../models/branch.model';
import { BranchService } from '../../services/branch.service';

@Component({ selector: 'app-locations', standalone: true, imports: [NgTemplateOutlet], templateUrl: './locations.component.html', styleUrl: './locations.component.css' })
export class LocationsComponent {
  readonly branchService = inject(BranchService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  readonly groups = this.branchService.branchGroups;
  readonly activeGroup = signal<BranchGroup>(this.branchService.selectedBranch().group);
  readonly fullscreenMapOpen = signal(this.document.defaultView?.matchMedia('(min-width: 992px)').matches ?? false);
  readonly visibleBranches = computed(() => this.branchService.branchesFor(this.activeGroup()));
  readonly mapUrl = computed<SafeResourceUrl>(() => this.toEmbedUrl(this.branchService.selectedBranch()));
  readonly markerPositions = [
    { left: 12, top: 20 }, { left: 31, top: 36 }, { left: 53, top: 18 }, { left: 74, top: 32 }, { left: 20, top: 62 },
    { left: 43, top: 54 }, { left: 65, top: 66 }, { left: 84, top: 56 }, { left: 35, top: 78 }, { left: 57, top: 82 },
  ];
  private readonly syncActiveGroup = effect(() => this.activeGroup.set(this.branchService.selectedBranch().group));
  private readonly lockPageScroll = effect((onCleanup) => {
    const previousOverflow = this.document.body.style.overflow;
    if (this.fullscreenMapOpen()) this.document.body.style.overflow = 'hidden';
    onCleanup(() => { this.document.body.style.overflow = previousOverflow; });
  });

  selectGroup(group: BranchGroup): void {
    this.activeGroup.set(group);
    const selected = this.branchService.selectedBranch();
    const firstBranch = this.branchService.branchesFor(group)[0];
    if (selected.group !== group && firstBranch) this.branchService.select(firstBranch);
  }

  selectBranch(branch: Branch): void {
    this.activeGroup.set(branch.group);
    this.branchService.select(branch);
  }

  openFullscreenMap(): void { this.fullscreenMapOpen.set(true); }
  closeFullscreenMap(): void { this.fullscreenMapOpen.set(false); }

  @HostListener('document:keydown.escape')
  closeFullscreenMapWithEscape(): void { this.closeFullscreenMap(); }

  markerPosition(index: number): { left: number; top: number } { return this.markerPositions[index % this.markerPositions.length]; }

  directionsUrl(branch: Branch): string {
    const destination = encodeURIComponent(`Mercagan ${branch.name}${branch.address ? `, ${branch.address}` : ''}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`;
  }

  private toEmbedUrl(branch: Branch): SafeResourceUrl {
    const query = new URL(branch.mapsUrl).searchParams.get('query') ?? branch.address ?? branch.name;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com/maps?output=embed&q=${encodeURIComponent(query)}`);
  }
}
