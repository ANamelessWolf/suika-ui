import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  input,
  linkedSignal,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SUI_DEVICE_LAYOUTS, SuiDeviceLayout } from 'suika-ui';
import { DeviceFrame } from './device-frame';

export type DevicePreviewSelection = SuiDeviceLayout | 'all';

/**
 * Shows the same content in one or all five Suika UI device layouts.
 *
 * ```html
 * <dg-device-preview>
 *   <ng-template>
 *     <sui-something [data]="mock" />
 *   </ng-template>
 * </dg-device-preview>
 * ```
 */
@Component({
  selector: 'dg-device-preview',
  imports: [MatButtonToggleModule, MatIconModule, MatTooltipModule, DeviceFrame],
  template: `
    <mat-button-toggle-group
      class="toolbar"
      hideSingleSelectionIndicator
      [value]="selection()"
      (change)="selection.set($event.value)"
      aria-label="Device layout"
    >
      <mat-button-toggle value="all" matTooltip="All layouts">
        <mat-icon>dashboard</mat-icon>
        <span class="toggle-label">All</span>
      </mat-button-toggle>
      @for (spec of devices; track spec.id) {
        <mat-button-toggle [value]="spec.id" [matTooltip]="spec.label" [attr.aria-label]="spec.label">
          <mat-icon>{{ spec.icon }}</mat-icon>
        </mat-button-toggle>
      }
    </mat-button-toggle-group>

    @if (selection() === 'all') {
      <div class="grid">
        @for (spec of devices; track spec.id) {
          <dg-device-frame
            [class]="'cell cell--' + spec.id"
            [device]="spec.id"
            [content]="template()"
            [maxHeight]="spec.kind === 'mobile' ? 460 : 520"
          />
        }
      </div>
    } @else {
      <dg-device-frame [device]="$any(selection())" [content]="template()" [maxHeight]="720" />
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      border-radius: var(--dg-radius-lg);
      background:
        radial-gradient(circle at 1px 1px, var(--mat-sys-outline-variant) 1px, transparent 0) 0 0 / 20px 20px,
        var(--mat-sys-surface-container-low);
      border: 1px solid var(--mat-sys-outline-variant);
    }
    .toolbar {
      align-self: flex-start;
      flex-wrap: wrap;
    }
    .toggle-label {
      margin-left: 6px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
      align-items: start;
    }
    .cell--desktop-landscape {
      grid-column: 1 / -1;
    }
    @media (max-width: 720px) {
      .grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicePreview {
  /** Template to render. Alternatively, project an `<ng-template>` as content. */
  readonly content = input<TemplateRef<unknown> | null>(null);
  /** Initially selected layout. */
  readonly initial = input<DevicePreviewSelection>('all');

  private readonly projected = contentChild(TemplateRef);
  protected readonly template = computed(() => this.content() ?? this.projected() ?? null);
  protected readonly selection = linkedSignal<DevicePreviewSelection>(() => this.initial());
  protected readonly devices = SUI_DEVICE_LAYOUTS;
}
