import {
  SUI_DEFAULT_LAYOUT_THRESHOLDS,
  SuiDeviceLayout,
  SuiLayoutThresholds,
  SuiViewportSize,
} from './device-layout.model';

export interface SuiResolveLayoutOptions {
  /** Whether the primary input is a coarse pointer (touch). Helps tell phones from small desktop windows. */
  readonly coarsePointer?: boolean;
  readonly thresholds?: SuiLayoutThresholds;
}

/**
 * Pure function that maps an area size to a {@link SuiDeviceLayout}.
 *
 * Resolution order:
 * 1. `width < mobilePortraitMaxWidth` → `mobile-portrait`
 * 2. landscape, `height < mobileLandscapeMaxHeight` and (coarse pointer or `width < mobileLandscapeMaxWidth`) → `mobile-landscape`
 * 3. `width >= desktopLandscapeMinWidth` → `desktop-landscape`
 * 4. `height >= desktopHalfMinHeight` → `desktop-half`
 * 5. otherwise → `desktop-quarter`
 */
export function resolveDeviceLayout(
  size: SuiViewportSize,
  options: SuiResolveLayoutOptions = {},
): SuiDeviceLayout {
  const t = options.thresholds ?? SUI_DEFAULT_LAYOUT_THRESHOLDS;
  const { width, height } = size;
  const isLandscape = width > height;

  if (width < t.mobilePortraitMaxWidth) {
    return 'mobile-portrait';
  }
  if (
    isLandscape &&
    height < t.mobileLandscapeMaxHeight &&
    (options.coarsePointer || width < t.mobileLandscapeMaxWidth)
  ) {
    return 'mobile-landscape';
  }
  if (width >= t.desktopLandscapeMinWidth) {
    return 'desktop-landscape';
  }
  return height >= t.desktopHalfMinHeight ? 'desktop-half' : 'desktop-quarter';
}
