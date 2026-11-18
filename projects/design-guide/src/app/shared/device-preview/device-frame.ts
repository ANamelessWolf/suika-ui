import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SuiDeviceLayout, SuiLayoutHost, getDeviceLayoutSpec } from 'suika-ui';

/**
 * Renders content inside a scaled, device-sized screen. The screen is a `[suiLayoutHost]`, so
 * Suika UI components inside it resolve the frame's device layout instead of the viewport's.
 */
@Component({
  selector: 'dg-device-frame',
  imports: [NgTemplateOutlet, MatIconModule, SuiLayoutHost],
  template: `
    <div class="caption">
      <mat-icon>{{ spec().icon }}</mat-icon>
      <span class="label">{{ spec().label }}</span>
      <span class="size">{{ spec().width }} × {{ spec().height }} · {{ percent() }}%</span>
    </div>
    <div
      class="viewport"
      [class.viewport--mobile]="spec().kind === 'mobile'"
      [style.width.px]="spec().width * scale()"
      [style.height.px]="spec().height * scale()"
    >
      <div
        class="screen"
        [suiLayoutHost]="device()"
        [style.width.px]="spec().width"
        [style.height.px]="spec().height"
        [style.transform]="'scale(' + scale() + ')'"
      >
        <ng-container [ngTemplateOutlet]="content()" />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }
    .caption {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-label-large);
    }
    .caption mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .size {
      margin-left: auto;
      font: var(--mat-sys-label-small);
      font-family: var(--dg-font-mono);
    }
    .viewport {
      position: relative;
      overflow: hidden;
      border-radius: 14px;
      border: 1px solid var(--mat-sys-outline-variant);
      box-shadow: var(--dg-shadow-soft);
      background: var(--mat-sys-surface);
    }
    .viewport--mobile {
      border-radius: 28px;
      border: 6px solid var(--mat-sys-inverse-surface);
    }
    .screen {
      position: absolute;
      inset: 0 auto auto 0;
      transform-origin: top left;
      overflow: auto;
      box-sizing: border-box;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceFrame {
  readonly device = input.required<SuiDeviceLayout>();
  readonly content = input.required<TemplateRef<unknown> | null>();
  /** Maximum rendered height in CSS pixels; tall frames are scaled down to fit. */
  readonly maxHeight = input(560);

  private readonly available = signal(0);
  protected readonly spec = computed(() => getDeviceLayoutSpec(this.device()));
  protected readonly scale = computed(() => {
    const { width, height } = this.spec();
    const byWidth = this.available() > 0 ? this.available() / width : 1;
    return Math.min(1, byWidth, this.maxHeight() / height);
  });
  protected readonly percent = computed(() => Math.round(this.scale() * 100));

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    let observer: ResizeObserver | undefined;
    afterNextRender(() => {
      this.available.set(host.clientWidth);
      observer = new ResizeObserver(([entry]) => this.available.set(entry.contentRect.width));
      observer.observe(host);
    });
    inject(DestroyRef).onDestroy(() => observer?.disconnect());
  }
}
