import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, Signal, computed, inject, signal } from '@angular/core';
import { SUI_CONFIG } from '../config/suika-ui.config';
import { SuiDeviceLayout, SuiViewportSize, getDeviceLayoutSpec } from './device-layout.model';
import { resolveDeviceLayout } from './resolve-device-layout';

/**
 * Signal-based source of the current device layout.
 *
 * Components inject this abstraction instead of reading the window directly. By default it
 * resolves to the viewport-wide {@link SuiViewportLayout}; a `[suiLayoutHost]` element provides a
 * scoped context measured from its own size, so the same component adapts to its container
 * (e.g. side-by-side device previews in the design guide).
 */
@Injectable({
  providedIn: 'root',
  useFactory: () => inject(SuiViewportLayout),
})
export abstract class SuiLayoutContext {
  /** Measured size of the area the layout is resolved for. */
  abstract readonly size: Signal<SuiViewportSize>;
  /** Current device layout. */
  abstract readonly layout: Signal<SuiDeviceLayout>;

  readonly isMobile = computed(() => this.layout().startsWith('mobile'));
  readonly isDesktop = computed(() => this.layout().startsWith('desktop'));
  readonly orientation = computed<'landscape' | 'portrait'>(() => {
    const { width, height } = this.size();
    return width > height ? 'landscape' : 'portrait';
  });

  /** Returns `true` when the current layout is one of the given layouts. Reactive inside signal contexts. */
  is(...layouts: SuiDeviceLayout[]): boolean {
    return layouts.includes(this.layout());
  }
}

/**
 * Viewport-wide layout context. Tracks the window size and pointer type with signals.
 * SSR-safe: without a window it reports the configured `serverLayout`.
 */
@Injectable({ providedIn: 'root' })
export class SuiViewportLayout extends SuiLayoutContext {
  private readonly config = inject(SUI_CONFIG);
  private readonly window = inject(DOCUMENT).defaultView;

  private readonly _size = signal<SuiViewportSize>(this.readSize());
  private readonly _coarsePointer = signal(false);

  readonly size = this._size.asReadonly();
  /** Whether the primary pointer is coarse (touch). */
  readonly coarsePointer = this._coarsePointer.asReadonly();
  readonly layout = computed(() =>
    this.window
      ? resolveDeviceLayout(this._size(), {
          coarsePointer: this._coarsePointer(),
          thresholds: this.config.layout.thresholds,
        })
      : this.config.layout.serverLayout,
  );

  constructor() {
    super();
    const win = this.window;
    if (!win) {
      return;
    }

    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => this._size.set(this.readSize()));
    };
    win.addEventListener('resize', onResize, { passive: true });

    const pointerQuery = win.matchMedia?.('(pointer: coarse)');
    const onPointerChange = (event: MediaQueryListEvent) => this._coarsePointer.set(event.matches);
    if (pointerQuery) {
      this._coarsePointer.set(pointerQuery.matches);
      pointerQuery.addEventListener?.('change', onPointerChange);
    }

    inject(DestroyRef).onDestroy(() => {
      cancelAnimationFrame(frame);
      win.removeEventListener('resize', onResize);
      pointerQuery?.removeEventListener?.('change', onPointerChange);
    });
  }

  private readSize(): SuiViewportSize {
    if (!this.window) {
      const { width, height } = getDeviceLayoutSpec(this.config.layout.serverLayout);
      return { width, height };
    }
    return { width: this.window.innerWidth, height: this.window.innerHeight };
  }
}

/** Shorthand for `inject(SuiLayoutContext)`. Must run in an injection context. */
export function injectSuiLayout(): SuiLayoutContext {
  return inject(SuiLayoutContext);
}
