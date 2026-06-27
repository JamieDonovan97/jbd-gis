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

## Docs

- [Architecture overview](docs/architecture.md)
- [ADR-001 — Monorepo structure](docs/adr/001-monorepo-structure.md)
- [ADR-002 — Tech stack](docs/adr/002-tech-stack.md)
- [ADR-003 — Infrastructure layout](docs/adr/003-infra-layout.md)
