/**
 * The five device layouts every Suika UI component must support.
 *
 * - `desktop-landscape`: full desktop window (reference 1920×1080).
 * - `desktop-half`: desktop window snapped to half of the screen (reference 960×1080).
 * - `desktop-quarter`: desktop window snapped to a quarter of the screen (reference 960×540).
 * - `mobile-landscape`: phone held horizontally (reference 844×390).
 * - `mobile-portrait`: phone held vertically (reference 390×844).
 */
export type SuiDeviceLayout =
  | 'desktop-landscape'
  | 'desktop-half'
  | 'desktop-quarter'
  | 'mobile-landscape'
  | 'mobile-portrait';

/** Width and height, in CSS pixels, of the area a layout is resolved for. */
export interface SuiViewportSize {
  readonly width: number;
  readonly height: number;
}

/** Descriptive metadata for a device layout, used by docs and previews. */
export interface SuiDeviceLayoutSpec extends SuiViewportSize {
  readonly id: SuiDeviceLayout;
  readonly label: string;
  /** Material Symbols icon name that represents the device. */
  readonly icon: string;
  readonly kind: 'desktop' | 'mobile';
}

/**
 * Size thresholds, in CSS pixels, used to resolve a {@link SuiDeviceLayout}.
 * See `resolveDeviceLayout` for the exact resolution order.
 */
export interface SuiLayoutThresholds {
  /** Below this width the layout is always `mobile-portrait`. */
  readonly mobilePortraitMaxWidth: number;
  /** A landscape area shorter than this height may be `mobile-landscape`. */
  readonly mobileLandscapeMaxHeight: number;
  /** With a fine pointer, a short landscape area narrower than this is `mobile-landscape`. */
  readonly mobileLandscapeMaxWidth: number;
  /** At or above this width the layout is `desktop-landscape`. */
  readonly desktopLandscapeMinWidth: number;
  /** Between mobile and desktop-landscape widths, areas at least this tall are `desktop-half`, otherwise `desktop-quarter`. */
  readonly desktopHalfMinHeight: number;
}

export const SUI_DEFAULT_LAYOUT_THRESHOLDS: SuiLayoutThresholds = {
  mobilePortraitMaxWidth: 600,
  mobileLandscapeMaxHeight: 500,
  mobileLandscapeMaxWidth: 900,
  desktopLandscapeMinWidth: 1280,
  desktopHalfMinHeight: 720,
};

/** Ordered list of every device layout, from largest to smallest. */
export const SUI_DEVICE_LAYOUTS: readonly SuiDeviceLayoutSpec[] = [
  { id: 'desktop-landscape', label: 'Desktop landscape', icon: 'desktop_windows', kind: 'desktop', width: 1920, height: 1080 },
  { id: 'desktop-half', label: 'Desktop half', icon: 'splitscreen_left', kind: 'desktop', width: 960, height: 1080 },
  { id: 'desktop-quarter', label: 'Desktop quarter', icon: 'grid_view', kind: 'desktop', width: 960, height: 540 },
  { id: 'mobile-landscape', label: 'Mobile landscape', icon: 'stay_current_landscape', kind: 'mobile', width: 844, height: 390 },
  { id: 'mobile-portrait', label: 'Mobile portrait', icon: 'smartphone', kind: 'mobile', width: 390, height: 844 },
];

/** Returns the spec for a given layout id. */
export function getDeviceLayoutSpec(layout: SuiDeviceLayout): SuiDeviceLayoutSpec {
  return SUI_DEVICE_LAYOUTS.find((spec) => spec.id === layout)!;
}
