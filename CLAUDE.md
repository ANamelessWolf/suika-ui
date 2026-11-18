# Suika UI — project guide for Claude

Suika UI is an Angular component library (published to npm as `suika-ui`) built on
[Angular Material](https://material.angular.dev), plus a design-guide web app that documents
every component with live previews in five device layouts.

**Language:** all code, comments, documentation and READMEs are written in **English**.

## Workspace

```
projects/
  suika-ui/                 Library (ng-packagr) → dist/suika-ui → npm
    src/public-api.ts       Public surface. Every export consumers need goes here.
    src/lib/core/           Config (provideSuikaUi) + responsive layout system
    src/lib/components/     One folder per component (see "Component conventions")
    src/styles/             Public Sass API: theme + layout mixins (shipped as suika-ui/styles)
  design-guide/             Angular app: live docs, examples, mock data, device previews
    src/app/core/           doc-registry.ts (drives routes + nav), theme service
    src/app/shared/         Doc building blocks: dg-doc-page, dg-doc-section, dg-example,
                            dg-device-preview, dg-device-frame, dg-code-block, dg-api-table
    src/app/pages/          Home, foundations, components overview
    src/app/pages/components/<slug>/   One docs page per component
.claude/agents/             suika-component-builder, suika-docs-writer
Dockerfile, docker-compose.yml, docker/nginx.conf
```

The design guide imports `suika-ui` from **source** (`tsconfig.json` paths →
`projects/suika-ui/src/public-api.ts`) and Sass from `../../suika-ui/src/styles`, so `ng serve`
hot-reloads library changes. `npm run build:lib` validates the real package.

## Commands

| Task | Command |
| --- | --- |
| Design guide dev server | `npm start` (http://localhost:4200) |
| Build library | `npm run build:lib` |
| Build design guide | `npm run build:guide` |
| Test library / guide | `npm run test:lib` / `npm run test:guide` |
| Docker (prod, :8080) | `npm run docker:up` |
| Docker (dev, :4242) | `npm run docker:dev` |

**Windows note:** run `ng test` from a path with an **uppercase** drive letter (`Z:\dev\...`, e.g.
via PowerShell `Set-Location Z:\dev\node\suika-ui`). With a lowercase drive (`z:/...`, as Git Bash
reports), Vitest loads twice and fails with "Vitest failed to find the runner".

Versions: Angular 21.x, Angular Material 21.x, Vitest, zoneless (no zone.js). Local Node is
22.16; Angular 22 needs Node ≥ 22.22.3, so upgrade Node before `ng update` to 22.

## Responsive layout system (core contract)

Five layouts, type `SuiDeviceLayout`:
`desktop-landscape` (1920×1080) · `desktop-half` (960×1080) · `desktop-quarter` (960×540) ·
`mobile-landscape` (844×390) · `mobile-portrait` (390×844).

- `resolveDeviceLayout(size, { coarsePointer, thresholds })`: pure, size-based resolution.
- `SuiLayoutContext` (abstract, injectable): `layout`, `size`, `isMobile`, `isDesktop`,
  `orientation` signals and `is(...layouts)`. Get it with `injectSuiLayout()`.
- Default context = `SuiViewportLayout` (window size + pointer, SSR-safe).
- `[suiLayoutHost]` directive scopes the context to an element (measured with ResizeObserver,
  or forced: `suiLayoutHost="mobile-portrait"`). The design guide's device frames use it.
- Sass: `@include sui.layout(mobile-portrait, mobile-landscape) { ... }`, `sui.desktop`,
  `sui.mobile`. These target `:host([data-sui-layout=...])`, so a component **must** bind
  `host: { '[attr.data-sui-layout]': 'layout.layout()' }`.

Never read `window` sizes or use `@media` width queries inside library components. Always use
the layout context, so components react to their container in previews and split views.

## Component conventions (library)

- Folder `src/lib/components/<name>/` with `<name>.ts`, `.html`, `.scss`, `.model.ts`,
  `.spec.ts`, `index.ts`. Export the folder from `public-api.ts` (alphabetical).
- Selector prefix `sui-`, class name `Sui<PascalName>` (e.g. `sui-data-table` → `SuiDataTable`).
  Directives: `[suiCamelName]`.
- Standalone, `ChangeDetectionStrategy.OnPush`, zoneless-safe. No NgModules.
- Signals API only: `input()`, `input.required()`, `model()`, `output()`, `computed()`,
  `linkedSignal()`, `effect()` sparingly. No `@Input`/`@Output` decorators, no `ngOnChanges`.
- Use `inject()` instead of constructor parameters. Use `host: {}` instead of `@HostBinding`.
- Template control flow: `@if`, `@for` (with `track`), `@switch`, `@let`. No `*ngIf`/`*ngFor`.
- Models: the interfaces and types that feed a component live in `<name>.model.ts`, prefixed `Sui`,
  `readonly` properties, documented with TSDoc, generic where data is user-defined
  (e.g. `SuiTableColumn<T>`). No `any`.
- Build on Angular Material/CDK components and tokens. Style with `--mat-sys-*` system tokens
  and `mat.<component>-overrides()`. No hard-coded colors, fonts or shadows.
- Every component must explicitly design all five layouts (see the builder agent's layout
  matrix). Touch targets ≥ 48px in mobile layouts.
- Accessibility: WCAG 2.2 AA. Full keyboard support, visible focus, correct roles and ARIA,
  labels for icon-only controls, `prefers-reduced-motion` respected.
- Tests (Vitest + TestBed): creation, inputs/outputs, accessibility attributes, and behavior in
  every layout (wrap in `<div [suiLayoutHost]="layout">` or provide a `SuiLayoutContext`).
- Public APIs get TSDoc comments; they feed the design guide's API tables.

## Documentation conventions (design guide)

- One page per component at `src/app/pages/components/<slug>/`:
  `<slug>-docs.ts|html|scss`, `<slug>.mock.ts` (typed with the library models), and optional
  `examples/` components for complex demos.
- Page skeleton: `dg-doc-page` → sections: Overview, Examples (`dg-example` per variant, with
  snippets that match the live example exactly), Responsive behavior (the five layouts),
  Accessibility, API (`dg-api-table`), Models (`dg-code-block`).
- Register the page in `src/app/core/doc-registry.ts` (`DOC_REGISTRY`, sorted by name). Routes,
  navigation and the catalog are generated from it.
- Add a row to the components table in `projects/suika-ui/README.md`.
- Design-guide selectors use the `dg-` prefix. Use the same signal/OnPush conventions.

## Agents

- `suika-component-builder`: designs and implements a library component (+ models, styles,
  tests, public API) and returns a hand-off summary.
- `suika-docs-writer`: writes the design-guide page, mock data and README entry for an existing
  component.

Typical flow: run the builder, then the docs writer with the builder's summary.
