import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import {
  SUI_DEFAULT_LAYOUT_THRESHOLDS,
  SuiDeviceLayout,
  SuiLayoutThresholds,
} from '../layout/device-layout.model';

/** Resolved, library-wide configuration. */
export interface SuiConfig {
  readonly layout: {
    readonly thresholds: SuiLayoutThresholds;
    /** Layout assumed when no window is available (SSR, prerender, tests without a DOM). */
    readonly serverLayout: SuiDeviceLayout;
  };
}

/** Partial configuration accepted by {@link provideSuikaUi}. */
export interface SuiConfigOptions {
  readonly layout?: {
    readonly thresholds?: Partial<SuiLayoutThresholds>;
    readonly serverLayout?: SuiDeviceLayout;
  };
}

export const SUI_DEFAULT_CONFIG: SuiConfig = {
  layout: {
    thresholds: SUI_DEFAULT_LAYOUT_THRESHOLDS,
    serverLayout: 'desktop-landscape',
  },
};

export const SUI_CONFIG = new InjectionToken<SuiConfig>('SUI_CONFIG', {
  providedIn: 'root',
  factory: () => SUI_DEFAULT_CONFIG,
});

/**
 * Registers Suika UI with optional configuration.
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [provideSuikaUi({ layout: { thresholds: { desktopLandscapeMinWidth: 1440 } } })],
 * });
 * ```
 */
export function provideSuikaUi(options: SuiConfigOptions = {}): EnvironmentProviders {
  const config: SuiConfig = {
    layout: {
      thresholds: { ...SUI_DEFAULT_CONFIG.layout.thresholds, ...options.layout?.thresholds },
      serverLayout: options.layout?.serverLayout ?? SUI_DEFAULT_CONFIG.layout.serverLayout,
    },
  };
  return makeEnvironmentProviders([{ provide: SUI_CONFIG, useValue: config }]);
}
