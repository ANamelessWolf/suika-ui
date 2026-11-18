import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DOC_CATEGORY_LABELS, DOC_REGISTRY } from '../../core/doc-registry';
import { DocPage } from '../../shared/doc-page/doc-page';

@Component({
  selector: 'dg-components-overview',
  imports: [FormsModule, RouterLink, MatIconModule, DocPage],
  template: `
    <dg-doc-page
      eyebrow="Components"
      title="Component catalog"
      description="Every component is documented with live previews in all five device layouts, code samples and its typed API."
    >
      @if (entries.length) {
        <label class="search">
          <mat-icon>search</mat-icon>
          <input type="search" placeholder="Search components" [(ngModel)]="query" aria-label="Search components" />
        </label>
        <div class="grid">
          @for (entry of filtered(); track entry.slug) {
            <a class="card" [routerLink]="['/components', entry.slug]">
              <span class="card__icon"><mat-icon>{{ entry.icon }}</mat-icon></span>
              <span class="card__meta">{{ categoryLabels[entry.category] }} · {{ entry.status }}</span>
              <h2>{{ entry.name }}</h2>
              <p>{{ entry.description }}</p>
            </a>
          } @empty {
            <p class="muted">No components match "{{ query() }}".</p>
          }
        </div>
      } @else {
        <div class="empty">
          <span class="empty__icon"><mat-icon>construction</mat-icon></span>
          <h2>No components yet</h2>
          <p>
            Components are added by the <code>suika-component-builder</code> agent and documented by the
            <code>suika-docs-writer</code> agent. Each one registers itself in <code>doc-registry.ts</code> and appears here.
          </p>
        </div>
      }
    </dg-doc-page>
  `,
  styles: `
    .search {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 420px;
      padding: 0 16px;
      height: 48px;
      border-radius: 999px;
      background: var(--mat-sys-surface-container-high);
      color: var(--mat-sys-on-surface-variant);
    }
    .search:focus-within {
      outline: 2px solid var(--mat-sys-primary);
    }
    .search input {
      flex: 1;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--mat-sys-on-surface);
      font: var(--mat-sys-body-large);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
    .card {
      display: flex;
      flex-direction: column;
      padding: 24px;
      border-radius: var(--dg-radius-lg);
      background: var(--mat-sys-surface-container);
      color: inherit;
      text-decoration: none;
      transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--dg-shadow-soft);
      background: var(--mat-sys-surface-container-high);
    }
    .card:focus-visible {
      outline: 2px solid var(--mat-sys-primary);
      outline-offset: 2px;
    }
    .card__icon,
    .empty__icon {
      display: inline-grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 16px;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
    .card__meta {
      margin-top: 16px;
      font: var(--mat-sys-label-medium);
      color: var(--mat-sys-on-surface-variant);
      text-transform: capitalize;
    }
    .card h2 {
      margin: 4px 0;
      font: var(--mat-sys-title-medium);
      font-weight: 600;
    }
    .card p,
    .muted {
      margin: 0;
      font: var(--mat-sys-body-medium);
      color: var(--mat-sys-on-surface-variant);
    }
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 24px;
      border-radius: var(--dg-radius-lg);
      border: 2px dashed var(--mat-sys-outline-variant);
    }
    .empty h2 {
      margin: 16px 0 8px;
      font: var(--mat-sys-title-large);
    }
    .empty p {
      max-width: 56ch;
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
    }
    @media (prefers-reduced-motion: reduce) {
      .card:hover {
        transform: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsOverview {
  protected readonly entries = DOC_REGISTRY;
  protected readonly categoryLabels = DOC_CATEGORY_LABELS;
  protected readonly query = signal('');
  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q
      ? this.entries.filter((e) => `${e.name} ${e.description} ${e.category}`.toLowerCase().includes(q))
      : this.entries;
  });
}
