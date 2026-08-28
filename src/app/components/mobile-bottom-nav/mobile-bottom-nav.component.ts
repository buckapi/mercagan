import { DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-mobile-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrl: './mobile-bottom-nav.component.css',
})
export class MobileBottomNavComponent {
  private readonly document = inject(DOCUMENT);
  private lastScrollY = 0;
  readonly isVisible = signal(true);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const window = this.document.defaultView;
    if (!window) return;

    const scrollY = window.scrollY;
    const reachedPageEnd = scrollY + window.innerHeight >= this.document.documentElement.scrollHeight - 2;
    this.isVisible.set(scrollY < 20 || scrollY <= this.lastScrollY || reachedPageEnd);
    this.lastScrollY = scrollY;
  }
}
