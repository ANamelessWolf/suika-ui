# Suika UI

Responsive, signal-based Angular UI components built on
[Angular Material](https://material.angular.dev). Every component is designed for five device
layouts: desktop landscape, desktop half, desktop quarter, mobile landscape and mobile portrait.

This repository contains:

| Project | Path | Description |
| --- | --- | --- |
| `suika-ui` | [`projects/suika-ui`](projects/suika-ui) | The library, published to npm (`npm install suika-ui`). |
| `design-guide` | [`projects/design-guide`](projects/design-guide) | Design guide web app with live examples, code and mock data, previewed in every device layout. |

## Requirements

- Node.js `^20.19`, `^22.12` or `>=24` (Angular 21)
- npm 10+ (npm 11 recommended)
- Docker (optional, for the containerized design guide)

## Getting started

```bash
npm install
npm start            # design guide at http://localhost:4200
```

| Script | Description |
| --- | --- |
| `npm start` | Serve the design guide with hot reload (library consumed from source). |
| `npm run build` | Build the library, then the design guide. |
| `npm run build:lib` | Build the publishable package into `dist/suika-ui`. |
| `npm run watch:lib` | Rebuild the library on change. |
| `npm test` | Run library and design-guide unit tests (Vitest). |
| `npm run publish:lib` | Build and publish `dist/suika-ui` to npm. |
| `npm run docker:up` | Build and run the production design guide at http://localhost:8080. |
| `npm run docker:dev` | Run the dev server in Docker with hot reload at http://localhost:4242. |

## Docker

The [`Dockerfile`](Dockerfile) is multi-stage (Node 24 LTS for building, nginx for serving):

```bash
docker compose up --build design-guide                       # production build → :8080
docker compose -f docker-compose.dev.yml up --build           # dev server → :4242
```

## Responsive layouts

Components never read the window size directly. They inject a signal-based layout context:

```ts
import { injectSuiLayout } from 'suika-ui';

readonly layout = injectSuiLayout();
readonly compact = computed(() => this.layout.isMobile());
```

Wrap any region in `suiLayoutHost` to make components inside it respond to that container
instead of the viewport. This is how the design guide renders all five layouts side by side.
See the **Device layouts** page in the design guide for the resolution rules.

## Contributing with Claude Code agents

Components and their documentation are created by two project agents in
[`.claude/agents`](.claude/agents):

- **`suika-component-builder`** designs the component (API, models, five-layout matrix,
  accessibility), implements it with signals, writes the tests and exports it.
- **`suika-docs-writer`** writes the design-guide page with live examples, mock data, the API
  table and the README entry.

Conventions shared by both are in [`CLAUDE.md`](CLAUDE.md).

## License

[MIT](LICENSE)
