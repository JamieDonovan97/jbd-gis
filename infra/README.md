# infra

Local integration via Docker Compose. Not used in production — see [ADR-003](../docs/adr/003-infra-layout.md).

| Path | Holds |
|---|---|
| `docker-compose.yml` | The full local stack. |
| `nginx/nginx.conf` | Edge proxy for local integration. |

Run via [`scripts/dev.sh`](../scripts/).
