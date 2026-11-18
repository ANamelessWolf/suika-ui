import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dg-not-found',
  imports: [RouterLink, MatButtonModule],
  template: `
    <p class="code">404</p>
    <h1>This page doesn't exist</h1>
    <a mat-flat-button routerLink="/">Back to the guide</a>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 96px 16px;
      text-align: center;
    }
    .code {
      margin: 0;
      font-size: 6rem;
      font-weight: 800;
      letter-spacing: -0.05em;
      background: var(--dg-gradient-brand);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    h1 {
      margin: 0;
      font: var(--mat-sys-headline-small);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
