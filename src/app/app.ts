import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { SearchModalComponent } from './components/search-modal/search-modal.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterScrollService } from './services/router-scroll.service';

@Component({
  selector: 'app-root',
  imports: [
    BackToTopComponent,
    FooterComponent,
    HeaderComponent,
    PreloaderComponent,
    RouterOutlet,
    SearchModalComponent,
    SidebarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: { class: 'bg-color2' },
})
export class App implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly routerScrollService = inject(RouterScrollService);
  private readonly deferredScripts = [
    'jquery.waypoints.js',
    'jquery.counterup.min.js',
    'viewport.jquery.js',
    'magnific-popup.min.js',
    'tilt.min.js',
    'jquery.meanmenu.min.js',
    'wow.min.js',
    'nice-select.min.js',
    'main.js',
  ];
  private readonly document = inject(DOCUMENT);
  private readonly clickHandler = (event: MouseEvent) => this.handleClick(event);
  private readonly scrollHandler = () => this.updateBackToTop();

  get showFooter(): boolean {
    return !this.router.url.startsWith('/ubicaciones') && !this.router.url.startsWith('/menu');
  }

  ngAfterViewInit(): void {
    this.document.addEventListener('click', this.clickHandler);
    this.document.defaultView?.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.updateBackToTop();
    this.loadDeferredScripts();
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('click', this.clickHandler);
    this.document.defaultView?.removeEventListener('scroll', this.scrollHandler);
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target.closest('.search-trigger')) {
      event.preventDefault();
      this.document.querySelector<HTMLElement>('.search-wrap')?.classList.add('is-open');
      this.document.querySelector<HTMLElement>('.main-search-input')?.focus();
    }

    if (target.closest('.search-close')) {
      event.preventDefault();
      this.document.querySelector<HTMLElement>('.search-wrap')?.classList.remove('is-open');
    }

    if (target.closest('#back-top')) {
      event.preventDefault();
      this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateBackToTop(): void {
    const scrollTop = this.document.defaultView?.scrollY ?? 0;
    this.document.querySelector<HTMLElement>('#back-top')?.classList.toggle('show', scrollTop > 20);
  }

  private loadDeferredScripts(): void {
    const load = () => this.deferredScripts.reduce(
      (chain, script) => chain.then(() => this.appendScript(`assets/js/${script}`)),
      Promise.resolve(),
    );
    const window = this.document.defaultView as (Window & {
      requestIdleCallback?: (callback: () => void) => number;
    }) | null;

    if (window?.requestIdleCallback) {
      window.requestIdleCallback(() => void load());
      return;
    }

    window?.setTimeout(() => void load(), 1000);
  }

  private appendScript(source: string): Promise<void> {
    return new Promise((resolve) => {
      const script = this.document.createElement('script');
      script.src = source;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      this.document.head.appendChild(script);
    });
  }
}
