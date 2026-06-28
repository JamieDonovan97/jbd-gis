# jbd-gis

Geospatial platform for civil infrastructure data — PostGIS spatial queries, ASP.NET Core 10 API, React SPA.

> **Status: scaffold.** The structure, tooling, and deployment shape are in place; application code is not yet built. The PostGIS data layer (API) and the UI component layer (`shadcn/ui`) are planned and will be added as features land.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind v4 |
| Backend | ASP.NET Core 10, C# |
| Database | PostgreSQL 16 + PostGIS |
| Proxy | Nginx |
| Infra | Docker Compose |
| CI/CD | GitHub Actions |

## Repository layout

```
/
├── .github/workflows/   CI pipelines
├── apps/
│   ├── gis-api/         ASP.NET Core Web API
│   └── gis-web/         React + Vite frontend
├── docs/
│   ├── adr/             Architecture Decision Records
│   └── architecture.md  System overview
├── infra/               Docker Compose, Nginx config
└── scripts/             Developer utility scripts
```

## Prerequisites

- Docker + Docker Compose v2
- .NET 10 SDK (local API development)
- Node 20+ (local frontend development)

## Getting started

```bash
cp .env.example .env
./scripts/dev.sh setup   # one-time per clone: enables the git hook that keeps docs/structure.md in sync
```

### Local development

Run each service in a separate terminal:

```bash
./scripts/dev.sh db    # starts Postgres in Docker
./scripts/dev.sh api   # dotnet watch run
./scripts/dev.sh web   # npm run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:8080`
OpenAPI schema: `http://localhost:8080/openapi/v1.json`

### Full stack via Docker

```bash
docker compose -f infra/docker-compose.yml up --build
```

Services are routed through Nginx at `http://localhost:80`.

## Deployment

`gis-web` deploys to **Cloudflare Pages via Direct Upload from CI** — GitHub Actions
builds the bundle (stamping the real version with nbgv) and pushes it to Pages with
Wrangler. No Cloudflare↔GitHub app or repo access is granted; CI/CD stays in this repo.

The [`deploy`](.github/workflows/deploy.yml) workflow runs on push to `main` and is a
**no-op until** these are set:

| Needs | Where |
|---|---|
| `CLOUDFLARE_API_TOKEN` | GitHub repo secret — token scoped to **Account › Cloudflare Pages › Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub repo secret — from the Cloudflare dashboard sidebar |
| Pages project `jbd-gis` | Created once in Cloudflare: Workers & Pages → Create → Pages → **Upload assets** (Direct Upload), no Git connection |

SPA fallback is handled by [`public/_redirects`](apps/gis-web/public/_redirects). Attach a
custom domain in the Pages project → Custom domains. `gis-api` (Fly.io) and Supabase are
not yet deployed — see [architecture.md](docs/architecture.md).

## Docs

- [Architecture overview](docs/architecture.md)
- [ADR-001 — Monorepo structure](docs/adr/001-monorepo-structure.md)
- [ADR-002 — Tech stack](docs/adr/002-tech-stack.md)
- [ADR-003 — Infrastructure layout](docs/adr/003-infra-layout.md)
