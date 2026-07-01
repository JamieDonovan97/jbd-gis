# infra

Local development dependencies — the database the app runs against locally. Production is hosted per layer on managed platforms, not in-repo.

| Path | Holds |
|---|---|
| `docker-compose.yml` | Local PostGIS for development. |

Run via [`scripts/dev.sh`](../scripts/) (`db`). Rationale: [ADR-003](../docs/adr/003-infra-layout.md).
