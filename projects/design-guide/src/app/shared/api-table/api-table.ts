import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** One row of a component's public API. */
export interface ApiMember {
  readonly name: string;
  readonly kind: 'input' | 'model' | 'output' | 'method' | 'property';
  readonly type: string;
  readonly description: string;
  readonly default?: string;
  readonly required?: boolean;
}

/** Responsive API reference table (cards on narrow screens). */
@Component({
  selector: 'dg-api-table',
  template: `
    <div class="table" role="table" [attr.aria-label]="label()">
      <div class="row row--head" role="row">
        <span role="columnheader">Name</span>
        <span role="columnheader">Type</span>
        <span role="columnheader">Default</span>
        <span role="columnheader">Description</span>
      </div>
      @for (member of members(); track member.name) {
        <div class="row" role="row">
          <span role="cell" class="name">
            <code>{{ member.name }}</code>
            <span class="kind" [attr.data-kind]="member.kind">{{ member.kind }}</span>
            @if (member.required) {
              <span class="kind" data-kind="required">required</span>
            }
          </span>
          <span role="cell" class="type"><code>{{ member.type }}</code></span>
          <span role="cell" class="default">
            @if (member.default) {
              <code>{{ member.default }}</code>
            } @else {
              —
            }
          </span>
          <span role="cell" class="desc">{{ member.description }}</span>
        </div>
      } @empty {
        <div class="row" role="row"><span role="cell" class="desc">No public members.</span></div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .table {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: var(--dg-radius-md);
      overflow: hidden;
    }
    .row {
      display: grid;
      grid-template-columns: minmax(160px, 1.2fr) minmax(120px, 1fr) minmax(80px, 0.6fr) 2fr;
      gap: 16px;
      padding: 14px 16px;
      border-top: 1px solid var(--mat-sys-outline-variant);
      font: var(--mat-sys-body-medium);
      align-items: start;
    }
    .row--head {
      border-top: 0;
      background: var(--mat-sys-surface-container);
      font: var(--mat-sys-label-large);
      color: var(--mat-sys-on-surface-variant);
    }
    .name {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
    .kind {
      padding: 1px 8px;
      border-radius: 999px;
      font: var(--mat-sys-label-small);
      background: var(--mat-sys-surface-container-highest);
      color: var(--mat-sys-on-surface-variant);
    }
    .kind[data-kind='input'],
    .kind[data-kind='model'] {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
    .kind[data-kind='output'] {
      background: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-on-tertiary-container);
    }
    .kind[data-kind='required'] {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
    }
    .type code {
      word-break: break-word;
    }
    .desc {
      color: var(--mat-sys-on-surface-variant);
    }
    @media (max-width: 760px) {
      .row--head {
        display: none;
      }
      .row {
        grid-template-columns: 1fr;
        gap: 6px;
      }
      .row:nth-child(2) {
        border-top: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiTable {
  readonly members = input.required<readonly ApiMember[]>();
  readonly label = input('API reference');
}
