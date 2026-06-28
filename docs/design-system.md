# Design system

Conventions for `gis-web`. The architectural rationale is [ADR-004](adr/004-frontend-architecture.md); this is the working reference for how the front end is built.

## Token layers

Colour, spacing, radius, and type flow through two layers. Components reference the **semantic** layer only — never raw values, never primitives directly.

| Layer | File | Example | Who reads it |
|---|---|---|---|
| Primitive | `src/styles/tokens.css` | `--slate-100`, `--space-4`, `--radius-lg` | semantic layer only |
| Semantic | `src/styles/themes.css` | `--color-surface`, `--color-accent`, `--glass-bg` | components (via Tailwind) |

Tailwind v4 maps semantic tokens to utilities through `@theme inline`, so `bg-surface`, `text-muted`, and `rounded-lg` resolve from the token contract. Changing the whole palette is editing semantic values in one file.

## Themes

A theme is a set of semantic-token values under a `data-theme` selector:

```css
[data-theme='light'] { --color-bg: var(--white); --color-accent: var(--blue-500); /* … */ }
[data-theme='dark']  { --color-bg: var(--slate-950); --color-accent: var(--blue-400); /* … */ }
```

`ThemeProvider` sets `data-theme` on `<html>`, persists the choice, and follows the system preference until overridden. Light and dark are the first two instances; adding a brand theme is one more block plus a registry entry in `src/theme/themes.ts`. No component knows which theme is active.

## Glass

The frosted-glass surface is one primitive: `src/components/glass/GlassPanel.tsx`. It owns the recipe — translucent surface token, `backdrop-blur`, hairline border, shadow, radius. Every floating panel composes `GlassPanel`; the recipe is never re-implemented inline. Change glass once, everywhere follows.

## Primitives & variants

UI primitives live in `src/components/ui/` (shadcn/ui). Each carries its variants in a single `class-variance-authority` definition. Restyling all buttons is editing the Button `cva` config — not touching call sites. Per-instance overrides are disallowed; if a new look is needed, it is a new variant.

## Config-driven surfaces

Tools, layers, and basemaps are registries of objects, rendered by generic components:

| Registry | File | Shape |
|---|---|---|
| Tools | `src/features/gis/config/tools.ts` | `{ id, icon, label, panelId }` |
| Layers | `src/features/gis/config/layers.ts` | layer definition |
| Basemaps | `src/lib/map/basemaps.ts` | `{ id, label, provider, styleFor(themeMode) }` |

Adding a tool is adding an object. No component is edited to extend a surface.

## Folder structure

```
src/
  app/        shell, router, providers — the application platform
  features/   one folder per feature; self-contained
  components/ ui/ (primitives) · glass/ (GlassPanel)
  lib/        map/ · api/ — framework-agnostic helpers
  theme/      ThemeProvider, theme registry
  styles/     tokens.css · themes.css · index.css
```

A feature owns its components, config, store slice, and hooks under `features/<name>/`. The shell never imports from a feature; features never import each other.

## State

- **Server state** — TanStack Query (`src/lib/api/`).
- **Client/UI state** — Zustand, one slice per domain (`src/features/gis/store/`).
- **Theme** — `ThemeProvider`, persisted.

UI state slices are shaped to be URL-syncable via TanStack Router search params; the map view and selection are intended to become URL-addressable.
