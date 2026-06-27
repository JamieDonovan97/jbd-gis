# infra

Docker Compose setup for local integration. Not used in production — see [ADR-003](../docs/adr/003-infra-layout.md).

## Usage

From the repo root via `scripts/dev.sh`:

```bash
./scripts/dev.sh up      # full stack at http://localhost:80
./scripts/dev.sh db      # Postgres only
./scripts/dev.sh down
```

Or directly:

```bash
docker compose -f infra/docker-compose.yml up --build
```

## Contents

| Path | Purpose |
|---|---|
| `docker-compose.yml` | Full local stack |
| `nginx/nginx.conf` | Edge proxy for local integration |
