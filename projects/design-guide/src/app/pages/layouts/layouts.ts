import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SUI_DEFAULT_LAYOUT_THRESHOLDS, SUI_DEVICE_LAYOUTS } from 'suika-ui';
import { ApiMember, ApiTable } from '../../shared/api-table/api-table';
import { DocPage, DocSection } from '../../shared/doc-page/doc-page';
import { Example, ExampleSnippet } from '../../shared/example/example';
import { LayoutInspector } from './layout-inspector';

@Component({
  selector: 'dg-layouts',
  imports: [MatIconModule, DocPage, DocSection, Example, ApiTable, LayoutInspector],
  templateUrl: './layouts.html',
  styleUrl: './layouts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layouts {
  protected readonly devices = SUI_DEVICE_LAYOUTS;
  protected readonly t = SUI_DEFAULT_LAYOUT_THRESHOLDS;

  protected readonly snippets: ExampleSnippet[] = [
    {
      label: 'my-card.ts',
      language: 'ts',
      code: `
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectSuiLayout } from 'suika-ui';

@Component({
  selector: 'app-my-card',
  templateUrl: './my-card.html',
  styleUrl: './my-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-sui-layout]': 'layout.layout()' },
})
export class MyCard {
  protected readonly layout = injectSuiLayout();
}`,
    },
    {
      label: 'my-card.html',
      language: 'html',
      code: `
@if (layout.isMobile()) {
  <app-compact-summary />
} @else {
  <app-full-summary />
}`,
    },
    {
      label: 'my-card.scss',
      language: 'scss',
      code: `
@use 'suika-ui/styles' as sui;

.card { display: grid; grid-template-columns: auto 1fr auto; }

@include sui.layout(desktop-half, desktop-quarter) {
  .card { grid-template-columns: auto 1fr; }
}

@include sui.mobile {
  .card { grid-template-columns: 1fr; }
}`,
    },
    {
      label: 'host.html',
      language: 'html',
      code: `
<!-- Resolve layouts from a container instead of the viewport -->
<aside suiLayoutHost>
  <app-my-card />
</aside>

<!-- Or force one -->
<section suiLayoutHost="mobile-portrait">
  <app-my-card />
</section>`,
    },
  ];

  protected readonly api: ApiMember[] = [
    { name: 'layout', kind: 'property', type: 'Signal<SuiDeviceLayout>', description: 'Current device layout.' },
    { name: 'size', kind: 'property', type: 'Signal<SuiViewportSize>', description: 'Measured width and height of the viewport or host element.' },
    { name: 'isMobile', kind: 'property', type: 'Signal<boolean>', description: 'True for mobile-landscape and mobile-portrait.' },
    { name: 'isDesktop', kind: 'property', type: 'Signal<boolean>', description: 'True for the three desktop layouts.' },
    { name: 'orientation', kind: 'property', type: "Signal<'landscape' | 'portrait'>", description: 'Orientation of the measured area.' },
    { name: 'is(...layouts)', kind: 'method', type: '(...layouts: SuiDeviceLayout[]) => boolean', description: 'Whether the current layout is one of the given layouts. Reactive in signal contexts.' },
    { name: 'suiLayoutHost', kind: 'input', type: "SuiDeviceLayout | ''", default: "''", description: 'Directive input. Empty measures the element; a layout id forces it.' },
  ];
}
