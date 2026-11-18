import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CodeBlock, CodeLanguage } from '../code-block/code-block';
import { DevicePreview, DevicePreviewSelection } from '../device-preview/device-preview';

export interface ExampleSnippet {
  /** Tab label, usually the file name (e.g. `orders.component.ts`). */
  readonly label: string;
  readonly language: CodeLanguage;
  readonly code: string;
}

/**
 * Live example: device preview of the projected template plus its source code.
 *
 * ```html
 * <dg-example title="Basic usage" [snippets]="basicSnippets">
 *   <ng-template><sui-something [data]="mock" /></ng-template>
 * </dg-example>
 * ```
 */
@Component({
  selector: 'dg-example',
  imports: [MatButtonModule, MatIconModule, MatTabsModule, CodeBlock, DevicePreview],
  template: `
    <div class="head">
      <div>
        <h3>{{ title() }}</h3>
        @if (description()) {
          <p>{{ description() }}</p>
        }
      </div>
      @if (snippets().length) {
        <button mat-stroked-button (click)="showCode.update((v) => !v)" [attr.aria-expanded]="showCode()">
          <mat-icon>code</mat-icon>
          {{ showCode() ? 'Hide code' : 'Show code' }}
        </button>
      }
    </div>

    <dg-device-preview [content]="template() ?? null" [initial]="initial()" />

    @if (showCode() && snippets().length) {
      <mat-tab-group class="code" animationDuration="0ms" mat-stretch-tabs="false" mat-align-tabs="start">
        @for (snippet of snippets(); track snippet.label) {
          <mat-tab [label]="snippet.label">
            <dg-code-block [code]="snippet.code" [language]="snippet.language" [filename]="snippet.label" />
          </mat-tab>
        }
      </mat-tab-group>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    h3 {
      margin: 0;
      font: var(--mat-sys-title-large);
      font-weight: 600;
    }
    p {
      margin: 4px 0 0;
      color: var(--mat-sys-on-surface-variant);
    }
    .code dg-code-block {
      margin-top: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly snippets = input<readonly ExampleSnippet[]>([]);
  readonly initial = input<DevicePreviewSelection>('all');

  protected readonly template = contentChild(TemplateRef);
  protected readonly showCode = signal(false);
}
