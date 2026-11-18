import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type DgThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'dg-theme';
const ORDER: DgThemeMode[] = ['system', 'light', 'dark'];

/** Light / dark / system theme switcher for the design guide. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly mode = signal<DgThemeMode>(this.restore());

  constructor() {
    effect(() => {
      const mode = this.mode();
      const root = this.document.documentElement;
      root.classList.toggle('dg-light', mode === 'light');
      root.classList.toggle('dg-dark', mode === 'dark');
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // Storage may be unavailable (private mode); the theme still applies for this session.
      }
    });
  }

  cycle(): void {
    this.mode.update((mode) => ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]);
  }

  private restore(): DgThemeMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as DgThemeMode | null;
      return stored && ORDER.includes(stored) ? stored : 'system';
    } catch {
      return 'system';
    }
  }
}
