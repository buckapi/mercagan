import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Branch } from '../../models/branch.model';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css',
})
export class LocationsComponent {
  readonly branchService = inject(BranchService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  readonly groups: readonly Branch['group'][] = ['Bucaramanga y Santander', 'Bogotá'];
  readonly activeGroup = signal<Branch['group']>(this.branchService.selectedBranch().group);
  readonly fullscreenMapOpen = signal(
    this.document.defaultView?.matchMedia('(min-width: 992px)').matches ?? false,
  );
  private readonly syncActiveGroup = effect(() => {
    this.activeGroup.set(this.branchService.selectedBranch().group);
  });
  private readonly lockPageScroll = effect((onCleanup) => {
    const isFullscreen = this.fullscreenMapOpen();
    const body = this.document.body;
    const previousOverflow = body.style.overflow;

    if (isFullscreen) body.style.overflow = 'hidden';
    onCleanup(() => {
      body.style.overflow = previousOverflow;
    });
  });
  readonly visibleBranches = computed(() =>
    this.branchService.branches.filter((branch) => branch.group === this.activeGroup()),
  );
  readonly mapUrl = computed<SafeResourceUrl>(() => this.toEmbedUrl(this.branchService.selectedBranch()));
  readonly markerPositions = [
    { left: 12, top: 20 }, { left: 31, top: 36 }, { left: 53, top: 18 },
    { left: 74, top: 32 }, { left: 20, top: 62 }, { left: 43, top: 54 },
    { left: 65, top: 66 }, { left: 84, top: 56 }, { left: 35, top: 78 },
    { left: 57, top: 82 },
  ];

  selectGroup(group: Branch['group']): void {
    this.activeGroup.set(group);
    const selected = this.branchService.selectedBranch();
    const firstBranch = this.branchService.branches.find((branch) => branch.group === group);

    if (selected.group !== group && firstBranch) {
      this.branchService.select(firstBranch);
    }
  }

  selectBranch(branch: Branch): void {
    this.activeGroup.set(branch.group);
    this.branchService.select(branch);
  }

  openFullscreenMap(): void {
    this.fullscreenMapOpen.set(true);
  }

  closeFullscreenMap(): void {
    this.fullscreenMapOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  closeFullscreenMapWithEscape(): void {
    this.closeFullscreenMap();
  }

  markerPosition(index: number): { left: number; top: number } {
    return this.markerPositions[index % this.markerPositions.length];
  }

  directionsUrl(branch: Branch): string {
    const destination = encodeURIComponent(`Mercagan ${branch.name}, ${branch.address}`);

    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`;
  }

  private toEmbedUrl(branch: Branch): SafeResourceUrl {
    const query = new URL(branch.mapsUrl).searchParams.get('query') ?? branch.address;
    const embedUrl = `https://www.google.com/maps?output=embed&q=${encodeURIComponent(query)}`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
