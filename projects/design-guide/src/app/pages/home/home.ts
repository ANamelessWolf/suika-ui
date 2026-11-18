import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CodeBlock } from '../../shared/code-block/code-block';
import { DocSection } from '../../shared/doc-page/doc-page';

@Component({
  selector: 'dg-home',
  imports: [RouterLink, MatButtonModule, MatIconModule, CodeBlock, DocSection],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly features = [
    {
      icon: 'bolt',
      title: 'Signals first',
      text: 'Inputs, models and state are signals. Zoneless-ready and OnPush by default.',
    },
    {
      icon: 'devices',
      title: 'Five device layouts',
      text: 'Every component is designed for desktop landscape, half, quarter and both mobile orientations.',
    },
    {
      icon: 'palette',
      title: 'Material 3 foundation',
      text: 'Built on Angular Material and its system tokens, so it follows your theme, light or dark.',
    },
    {
      icon: 'data_object',
      title: 'Typed models',
      text: 'Each component ships the interfaces that feed it, so data contracts stay explicit.',
    },
  ];

  protected readonly installCode = `npm install suika-ui @angular/material @angular/cdk`;

  protected readonly provideCode = `
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideSuikaUi } from 'suika-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideSuikaUi()],
};`;

  protected readonly stylesCode = `
// styles.scss
@use 'suika-ui/styles' as sui;

html {
  color-scheme: light dark;
  @include sui.theme();
}`;
}
