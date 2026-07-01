# Architecture overview

Computation is placed by tier — see [ADR-005](adr/005-compute-placement.md). The deployables below are those tiers made concrete.

## Production topology

```
Browser — gis-web (Cloudflare Pages)
  ├─→ Supabase          managed PostGIS: owned data, access rules, precomputed artifacts
  ├─→ External sources  public basemaps, tiles, REST/WMS — read directly
  └─→ gis-api (Fly.io)  live per-request computation or a guarded secret — nothing routine

gis-engine (batch) ──writes──► Supabase   run-once geoprocessing, ahead of any request
```

The client reads owned data from Supabase and public layer data straight from its source, the same way it reads the imagery basemap. `gis-api` sits off the routine read path — it exists for computation that must run live or behind a secret. `gis-engine` runs offline, ahead of any request, and leaves its output where Supabase and the client can serve it as a static artifact.

## Services

| Service | Tier | Role |
|---|---|---|
| `gis-web` | Client | React SPA. Reads owned data from Supabase and public sources directly. |
| Supabase | Managed backend | PostgreSQL + PostGIS. Owned data, access rules, precomputed artifacts; the boundary that keeps secrets and rate-limited providers server-side. |
| `gis-api` | Request-time service | ASP.NET Core 10. Live per-request computation or secret-guarding. A stub today. |
| `gis-engine` | Offline batch | Python CLI. Run-once geoprocessing; writes artifacts, never on a request path. |
| Cloudflare Pages | — | Hosts `gis-web`; CDN delivery. |
| Fly.io | — | Hosts `gis-api`; runs `gis-engine` as batch machines. |

## Local development

Each service runs on its own; no edge proxy sits in the loop.

- `gis-web` — Vite dev server; reads Supabase and external sources directly.
- Supabase — a local PostGIS container, or the Supabase CLI for the fuller stack.
- `gis-api` — `dotnet watch`, when a route needs it.
- `gis-engine` — invoked ad hoc: `uv run gis-engine <job>`.
