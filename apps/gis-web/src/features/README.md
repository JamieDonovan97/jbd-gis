# features

One folder per view; each owns its components, state, config, and hooks.

| Path   | Holds                         |
| ------ | ----------------------------- |
| `gis/` | The full-screen GIS map view. |

Features never import each other; shared code moves to `components/` or `lib/`.
