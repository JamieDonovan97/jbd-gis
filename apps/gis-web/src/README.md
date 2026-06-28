# src

Directory map. Architecture: [ADR-004](../../../docs/adr/004-frontend-architecture.md). Conventions: [design-system.md](../../../docs/design-system.md).

| Directory     | Holds                                                       |
| ------------- | ----------------------------------------------------------- |
| `app/`        | Providers, router, and the shell.                           |
| `features/`   | One folder per view; owns its components, state, config.    |
| `components/` | Shared primitives and surfaces features compose.            |
| `lib/`        | Framework-agnostic helpers: map style registry, API access. |
| `theme/`      | Theme registration and provider.                            |
| `styles/`     | Design-token layers.                                        |

Features never import each other. Tokens and registries are the extension points — change visuals in `styles/`, add tools/layers/basemaps as data, not code.
