import { SUI_DEVICE_LAYOUTS } from './device-layout.model';
import { resolveDeviceLayout } from './resolve-device-layout';

describe('resolveDeviceLayout', () => {
  it.each(SUI_DEVICE_LAYOUTS.map((spec) => [spec.id, spec] as const))(
    'resolves the %s reference size to itself',
    (id, spec) => {
      expect(resolveDeviceLayout(spec)).toBe(id);
    },
  );

  it('treats a short landscape window with a fine pointer as desktop-quarter', () => {
    expect(resolveDeviceLayout({ width: 960, height: 420 })).toBe('desktop-quarter');
  });

  it('treats the same size with a coarse pointer as mobile-landscape', () => {
    expect(resolveDeviceLayout({ width: 960, height: 420 }, { coarsePointer: true })).toBe(
      'mobile-landscape',
    );
  });

  it('honours custom thresholds', () => {
    const thresholds = {
      mobilePortraitMaxWidth: 400,
      mobileLandscapeMaxHeight: 500,
      mobileLandscapeMaxWidth: 900,
      desktopLandscapeMinWidth: 1280,
      desktopHalfMinHeight: 720,
    };
    expect(resolveDeviceLayout({ width: 500, height: 900 }, { thresholds })).toBe('desktop-half');
  });
});
