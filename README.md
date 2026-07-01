# jbd-gis

Geospatial platform for civil infrastructure data. A full-screen web map over PostGIS, with computation split across a request-time service and an offline batch tier.

| Tier | Deployable | Stack | Host |
|---|---|---|---|
| Client | [`gis-web`](apps/gis-web/) | React 19, TypeScript, Vite, Tailwind v4 | Cloudflare Pages |
| Managed backend | Supabase | PostgreSQL 16 + PostGIS | Supabase |
| Request-time service | [`gis-api`](apps/gis-api/) | ASP.NET Core 10, C# | Fly.io |
| Offline batch | [`gis-engine`](apps/gis-engine/) | Python 3.12, Typer | Fly Machines |

The client reads owned data from Supabase and public layer data straight from source. `gis-api` handles live per-request work (a stub today); `gis-engine` runs offline batch jobs. How work splits across the tiers: [ADR-005](docs/adr/005-compute-placement.md).

## Layout

`apps/` holds the deployables, `docs/` the architecture and ADRs, `infra/` local orchestration, `scripts/` developer utilities. Full tree: [docs/structure.md](docs/structure.md).

## Docs

- [Architecture](docs/architecture.md) — topology and tiers
- [ADRs](docs/adr/) — decisions, in order
- [CONTRIBUTING](CONTRIBUTING.md) — workflow, branches, and the commands to run each unit
