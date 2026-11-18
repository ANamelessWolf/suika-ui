# suika-ui

Responsive, signal-based Angular UI components built on
[Angular Material](https://material.angular.dev). Each component adapts to five device layouts,
from a full desktop window to a phone in portrait, and ships the typed models that feed it.

## Installation

```bash
npm install suika-ui @angular/material @angular/cdk
```

Peer dependencies: `@angular/core`, `@angular/common`, `@angular/material` and `@angular/cdk`
(`^21.2.0`).

## Setup

Register the library providers:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideSuikaUi } from 'suika-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideSuikaUi()],
};
```

Apply the theme once in your global styles:

```scss
// styles.scss
@use '@angular/material' as mat;
@use 'suika-ui/styles' as sui;

html {
  color-scheme: light dark;
  @include sui.theme(); // optional: $primary, $tertiary, $typography, $density
}
```

## Device layouts

| Layout | Reference size | Typical context |
| --- | --- | --- |
| `desktop-landscape` | 1920 × 1080 | Full desktop window |
| `desktop-half` | 960 × 1080 | Window snapped to half of the screen |
| `desktop-quarter` | 960 × 540 | Window snapped to a quarter of the screen |
| `mobile-landscape` | 844 × 390 | Phone held horizontally |
| `mobile-portrait` | 390 × 844 | Phone held vertically |

The layout is resolved from size (and pointer type), not from the user agent. You can tune the
thresholds:

```ts
provideSuikaUi({
  layout: { thresholds: { desktopLandscapeMinWidth: 1440 } },
});
```

### Using the layout in your own components

```ts
import { Component, computed } from '@angular/core';
import { injectSuiLayout } from 'suika-ui';

@Component({
  selector: 'app-summary',
  host: { '[attr.data-sui-layout]': 'layout.layout()' },
  template: `@if (compact()) { <app-compact /> } @else { <app-full /> }`,
})
export class Summary {
  protected readonly layout = injectSuiLayout();
  protected readonly compact = computed(() => this.layout.isMobile());
}
```

```scss
@use 'suika-ui/styles' as sui;

@include sui.layout(desktop-half, desktop-quarter) { /* … */ }
@include sui.mobile { /* … */ }
```

### Container-scoped layouts

`suiLayoutHost` makes everything inside an element resolve its layout from that element's
size, or from a forced value:

```html
<aside suiLayoutHost>…</aside>
<section suiLayoutHost="mobile-portrait">…</section>
```

## Components

| Component | Selector | Description |
| --- | --- | --- |
| _No components yet_ | | |

## License

MIT
