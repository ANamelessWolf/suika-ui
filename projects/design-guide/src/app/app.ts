import { ChangeDetectionStrategy, Component, computed, effect, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SuiViewportLayout } from 'suika-ui';
import { DOC_CATEGORY_LABELS, DOC_REGISTRY, DocCategory, DocEntry } from './core/doc-registry';
import { ThemeService } from './core/theme.service';

interface NavGroup {
  readonly label: string;
  readonly items: readonly { readonly label: string; readonly icon: string; readonly link: string }[];
}

@Component({
  selector: 'dg-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly viewport = inject(SuiViewportLayout);
  protected readonly theme = inject(ThemeService);
  private readonly sidenav = viewChild.required(MatSidenav);

  /** The guide itself dogfoods the library's layout signals. */
  protected readonly isWide = computed(() => this.viewport.layout() === 'desktop-landscape');

  protected readonly themeIcon = computed(
    () => ({ system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode' })[this.theme.mode()],
  );

  protected readonly navGroups: readonly NavGroup[] = [
    {
      label: 'Getting started',
      items: [{ label: 'Introduction', icon: 'home', link: '/' }],
    },
    {
      label: 'Foundations',
      items: [{ label: 'Device layouts', icon: 'devices', link: '/foundations/layouts' }],
    },
    {
      label: 'Components',
      items: [{ label: 'Overview', icon: 'widgets', link: '/components' }],
    },
    ...groupByCategory(DOC_REGISTRY),
  ];

  constructor() {
    inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');

    // Close the overlay navigation after navigating on narrow layouts.
    const navigated = toSignal(inject(Router).events.pipe(filter((e) => e instanceof NavigationEnd)));
    effect(() => {
      navigated();
      if (!this.isWide()) {
        this.sidenav().close();
      }
    });
  }
}

function groupByCategory(entries: readonly DocEntry[]): NavGroup[] {
  const groups = new Map<DocCategory, DocEntry[]>();
  for (const entry of entries) {
    groups.set(entry.category, [...(groups.get(entry.category) ?? []), entry]);
  }
  return [...groups].map(([category, items]) => ({
    label: DOC_CATEGORY_LABELS[category],
    items: items.map((item) => ({ label: item.name, icon: item.icon, link: `/components/${item.slug}` })),
  }));
}
