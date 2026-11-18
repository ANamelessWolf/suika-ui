import { Routes } from '@angular/router';
import { DOC_REGISTRY } from './core/doc-registry';

export const routes: Routes = [
  {
    path: '',
    title: 'Suika UI',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'foundations/layouts',
    title: 'Device layouts · Suika UI',
    loadComponent: () => import('./pages/layouts/layouts').then((m) => m.Layouts),
  },
  {
    path: 'components',
    title: 'Components · Suika UI',
    loadComponent: () =>
      import('./pages/components-overview/components-overview').then((m) => m.ComponentsOverview),
  },
  ...DOC_REGISTRY.map((entry) => ({
    path: `components/${entry.slug}`,
    title: `${entry.name} · Suika UI`,
    loadComponent: entry.loadComponent,
  })),
  {
    path: '**',
    title: 'Not found · Suika UI',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
