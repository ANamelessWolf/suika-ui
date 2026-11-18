import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type CodeLanguage = 'ts' | 'html' | 'scss' | 'bash' | 'json';

/** Read-only code sample with a copy button. */
@Component({
  selector: 'dg-code-block',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="header">
      <span class="lang">{{ filename() || language() }}</span>
      <button
        mat-icon-button
        (click)="copy()"
        [matTooltip]="copied() ? 'Copied!' : 'Copy code'"
        [attr.aria-label]="copied() ? 'Copied' : 'Copy code'"
      >
        <mat-icon>{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
      </button>
    </div>
    <pre tabindex="0"><code>{{ code().trim() }}</code></pre>
  `,
  styles: `
    :host {
      display: block;
      border-radius: var(--dg-radius-md);
      background: var(--mat-sys-surface-container-highest);
      border: 1px solid var(--mat-sys-outline-variant);
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 4px 4px 16px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .lang {
      font: var(--mat-sys-label-medium);
      font-family: var(--dg-font-mono);
      color: var(--mat-sys-on-surface-variant);
    }
    pre {
      margin: 0;
      padding: 16px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.6;
      color: var(--mat-sys-on-surface);
    }
    pre:focus-visible {
      outline: 2px solid var(--mat-sys-primary);
      outline-offset: -2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlock {
  private readonly clipboard = inject(Clipboard);

  readonly code = input.required<string>();
  readonly language = input<CodeLanguage>('ts');
  readonly filename = input<string>();

  protected readonly copied = signal(false);

  protected copy(): void {
    if (this.clipboard.copy(this.code().trim())) {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    }
  }
}
