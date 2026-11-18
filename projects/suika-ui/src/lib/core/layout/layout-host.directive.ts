import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { SUI_CONFIG } from '../config/suika-ui.config';
import { SuiDeviceLayout, SuiViewportSize } from './device-layout.model';
import { SuiLayoutContext, SuiViewportLayout } from './layout-context';
import { resolveDeviceLayout } from './resolve-device-layout';

/**
 * Scopes the device layout to an element instead of the whole viewport.
 *
 * Every Suika UI component rendered inside the element resolves its layout from the element's
 * measured size. Pass a layout to force it regardless of size.
 *
 * ```html
 * <section suiLayoutHost>...</section>                      <!-- measured -->
 * <section suiLayoutHost="mobile-portrait">...</section>    <!-- forced -->
 * ```
 */
@Directive({
  selector: '[suiLayoutHost]',
  exportAs: 'suiLayoutHost',
  providers: [{ provide: SuiLayoutContext, useExisting: forwardRef(() => SuiLayoutHost) }],
  host: { '[attr.data-sui-layout]': 'layout()' },
})
export class SuiLayoutHost extends SuiLayoutContext {
  private readonly config = inject(SUI_CONFIG);
  private readonly viewport = inject(SuiViewportLayout);
  private readonly parent = inject(SuiLayoutContext, { skipSelf: true });
  private readonly measured = signal<SuiViewportSize | null>(null);

  /** Optional forced layout. An empty attribute means "measure the element". */
  readonly forcedLayout = input<SuiDeviceLayout | null, SuiDeviceLayout | '' | null | undefined>(
    null,
    { alias: 'suiLayoutHost', transform: (value) => value || null },
  );

  readonly size = computed(() => this.measured() ?? this.parent.size());
  readonly layout = computed<SuiDeviceLayout>(() => {
    const forced = this.forcedLayout();
    if (forced) {
      return forced;
    }
    const measured = this.measured();
    return measured
      ? resolveDeviceLayout(measured, {
          coarsePointer: this.viewport.coarsePointer(),
          thresholds: this.config.layout.thresholds,
        })
      : this.parent.layout();
  });

  constructor() {
    super();
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    let observer: ResizeObserver | undefined;

    afterNextRender(() => {
      // offsetWidth/Height ignore CSS transforms, so scaled previews still report their real size.
      if (element.offsetWidth > 0) {
        this.measured.set({ width: element.offsetWidth, height: element.offsetHeight });
      }
      if (typeof ResizeObserver === 'undefined') {
        return;
      }
      observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        this.measured.set({ width, height });
      });
      observer.observe(element);
    });

    inject(DestroyRef).onDestroy(() => observer?.disconnect());
  }
}
