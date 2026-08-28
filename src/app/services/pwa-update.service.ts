import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PwaUpdateService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly updates = inject(SwUpdate, { optional: true });
  readonly updateAvailable = signal(false);

  constructor() {
    const updates = this.updates;
    if (!updates?.isEnabled) return;

    updates.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateAvailable.set(true));

    void updates.checkForUpdate();
    const intervalId = this.document.defaultView?.setInterval(() => void updates.checkForUpdate(), 60 * 60 * 1000);
    this.destroyRef.onDestroy(() => intervalId && this.document.defaultView?.clearInterval(intervalId));
  }

  async installUpdate(): Promise<void> {
    if (!this.updates) return;

    await this.updates.activateUpdate();
    this.document.defaultView?.location.reload();
  }
}
