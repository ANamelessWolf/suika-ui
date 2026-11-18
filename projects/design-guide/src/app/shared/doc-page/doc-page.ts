import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Standard layout for every documentation page: hero header + projected sections.
 *
 * ```html
 * <dg-doc-page title="Button" eyebrow="Inputs" status="beta" description="...">
 *   <dg-doc-section title="Overview">...</dg-doc-section>
 * </dg-doc-page>
 * ```
 */
@Component({
  selector: 'dg-doc-page',
  template: `
    <header class="hero">
      @if (eyebrow()) {
        <p class="eyebrow">{{ eyebrow() }}</p>
      }
      <h1>
        {{ title() }}
        @if (status()) {
          <span class="status" [attr.data-status]="status()">{{ status() }}</span>
        }
      </h1>
      @if (description()) {
        <p class="description">{{ description() }}</p>
      }
      <ng-content select="[dgPageActions]" />
    </header>
    <div class="body">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .hero {
      padding-bottom: 32px;
      margin-bottom: 32px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .eyebrow {
      margin: 0 0 8px;
      font: var(--mat-sys-label-large);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--mat-sys-primary);
    }
    h1 {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin: 0;
      font: var(--mat-sys-display-small);
      font-weight: 700;
      letter-spacing: -0.03em;
    }
    .status {
      padding: 4px 10px;
      border-radius: 999px;
      font: var(--mat-sys-label-medium);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      background: var(--mat-sys-surface-container-highest);
      color: var(--mat-sys-on-surface-variant);
    }
    .status[data-status='stable'] {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
    .status[data-status='beta'] {
      background: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-on-tertiary-container);
    }
    .description {
      max-width: 70ch;
      margin: 12px 0 0;
      font: var(--mat-sys-title-medium);
      font-weight: 400;
      color: var(--mat-sys-on-surface-variant);
    }
    .body {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocPage {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly eyebrow = input<string>();
  readonly status = input<'draft' | 'beta' | 'stable'>();
}

/** A titled section inside a {@link DocPage}. `anchor` becomes the element id for deep links. */
@Component({
  selector: 'dg-doc-section',
  host: { '[attr.id]': 'anchor()' },
  template: `
    <h2>{{ title() }}</h2>
    @if (description()) {
      <p class="description">{{ description() }}</p>
    }
    <div class="content"><ng-content /></div>
  `,
  styles: `
    :host {
      display: block;
      scroll-margin-top: 80px;
    }
    h2 {
      margin: 0 0 8px;
      font: var(--mat-sys-headline-small);
      font-weight: 650;
      letter-spacing: -0.02em;
    }
    .description {
      max-width: 70ch;
      margin: 0 0 20px;
      color: var(--mat-sys-on-surface-variant);
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocSection {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly anchor = input<string>();
}
