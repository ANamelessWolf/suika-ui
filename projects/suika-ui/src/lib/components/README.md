# Components

Each Suika UI component lives in its own folder here. Components are created by the
`suika-component-builder` agent (see `.claude/agents/`) following the conventions in the root
`CLAUDE.md`.

```
components/
  <name>/
    <name>.ts            # Standalone component (signals, OnPush, host data-sui-layout)
    <name>.html          # Template (control flow: @if / @for / @switch)
    <name>.scss          # Styles, one block per device layout via `sui.layout(...)`
    <name>.model.ts      # Public models/interfaces that feed the component
    <name>.spec.ts       # Unit tests (Vitest), including all five device layouts
    index.ts             # Barrel: exports component + models
```

After adding a folder, export it from `src/public-api.ts`.
