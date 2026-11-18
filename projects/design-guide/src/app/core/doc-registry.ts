import { Type } from '@angular/core';

export type DocCategory = 'layout' | 'navigation' | 'inputs' | 'data-display' | 'feedback' | 'overlays';
export type DocStatus = 'draft' | 'beta' | 'stable';

/** One documented component in the design guide. */
export interface DocEntry {
  /** URL segment: /components/<slug>. Kebab-case, matches the library folder name. */
  readonly slug: string;
  /** Display name, e.g. "Data Table". */
  readonly name: string;
  readonly category: DocCategory;
  /** One sentence shown on cards and in the page header. */
  readonly description: string;
  /** Material Symbols icon name. */
  readonly icon: string;
  readonly status: DocStatus;
  /** Lazy-loads the documentation page component. */
  readonly loadComponent: () => Promise<Type<unknown>>;
}

export const DOC_CATEGORY_LABELS: Record<DocCategory, string> = {
  layout: 'Layout',
  navigation: 'Navigation',
  inputs: 'Inputs',
  'data-display': 'Data display',
  feedback: 'Feedback',
  overlays: 'Overlays',
};

/**
 * Registry of every component documentation page.
 *
 * The `suika-docs-writer` agent appends one entry per component, keeping the array sorted by
 * `name`. Routes, the side navigation and the components overview are generated from it.
 *
 * Example:
 * {
 *   slug: 'button',
 *   name: 'Button',
 *   category: 'inputs',
 *   description: 'Triggers an action with a single tap or click.',
 *   icon: 'smart_button',
 *   status: 'beta',
 *   loadComponent: () => import('../pages/components/button/button-docs').then((m) => m.ButtonDocs),
 * },
 */
export const DOC_REGISTRY: readonly DocEntry[] = [];
