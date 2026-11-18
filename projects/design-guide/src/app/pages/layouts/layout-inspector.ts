import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { getDeviceLayoutSpec, injectSuiLayout } from 'suika-ui';

/**
 * Demo-only component (not part of the library) that shows how a component consumes the
 * layout context: it reads signals and restyles itself per layout through its host attribute.
 */
@Component({
  selector: 'dg-layout-inspector',
  imports: [MatIconModule],
  host: { '[attr.data-sui-layout]': 'layout.layout()' },
  template: `
    <div class="card">
      <span class="icon"><mat-icon>{{ spec().icon }}</mat-icon></span>
      <div class="text">
        <p class="label">Resolved layout</p>
        <p class="value">{{ layout.layout() }}</p>
      </div>
      <dl class="facts">
        <div><dt>Size</dt><dd>{{ layout.size().width }} × {{ layout.size().height }}</dd></div>
        <div><dt>Orientation</dt><dd>{{ layout.orientation() }}</dd></div>
        <div><dt>Mobile</dt><dd>{{ layout.isMobile() }}</dd></div>
      </dl>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding: 24px;
      height: 100%;
      box-sizing: border-box;
      background: var(--dg-gradient-brand);
    }
    .card {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 24px;
      padding: 24px;
      border-radius: 24px;
      background: var(--mat-sys-surface);
      box-shadow: var(--dg-shadow-soft);
    }
    .icon {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
    .icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .label {
      margin: 0;
      font: var(--mat-sys-label-large);
      color: var(--mat-sys-on-surface-variant);
    }
    .value {
      margin: 4px 0 0;
      font: var(--mat-sys-headline-medium);
      font-weight: 700;
      font-family: var(--dg-font-mono);
    }
    .facts {
      display: flex;
      gap: 24px;
      margin: 0;
    }
    dt {
      font: var(--mat-sys-label-medium);
      color: var(--mat-sys-on-surface-variant);
    }
    dd {
      margin: 2px 0 0;
      font: var(--mat-sys-title-medium);
      font-family: var(--dg-font-mono);
    }

    :host([data-sui-layout='desktop-half']) .card,
    :host([data-sui-layout='desktop-quarter']) .card {
      grid-template-columns: auto 1fr;
    }
    :host([data-sui-layout='desktop-half']) .facts,
    :host([data-sui-layout='desktop-quarter']) .facts {
      grid-column: 1 / -1;
    }
    :host([data-sui-layout='mobile-landscape']) {
      padding: 12px;
    }
    :host([data-sui-layout='mobile-landscape']) .card {
      grid-template-columns: auto 1fr;
      gap: 12px;
      padding: 16px;
    }
    :host([data-sui-layout='mobile-landscape']) .facts {
      grid-column: 1 / -1;
    }
    :host([data-sui-layout='mobile-portrait']) {
      padding: 16px;
    }
    :host([data-sui-layout='mobile-portrait']) .card {
      grid-template-columns: 1fr;
      justify-items: start;
      gap: 16px;
    }
    :host([data-sui-layout='mobile-portrait']) .facts {
      flex-direction: column;
      gap: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutInspector {
  protected readonly layout = injectSuiLayout();
  protected readonly spec = computed(() => getDeviceLayoutSpec(this.layout.layout()));
}
