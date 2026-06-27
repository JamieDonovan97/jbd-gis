# Architecture overview

## Production topology

```
Cloudflare Pages (gis-web)
  ├── → Supabase PostgREST    (direct reads — spatial queries, feature data)
  └── → Fly.io gis-api        (computation — processing, analysis)
               └── → Supabase PostgreSQL + PostGIS
```

The frontend calls Supabase directly for reads where no server-side computation is required. The API exists for logic, not as a data proxy.

## Local topology (Docker Compose)

```
Host :80
  └── Nginx (edge proxy)
        ├── /api/*  ──►  gis-api:8080
        └── /*      ──►  gis-web:80
```

Postgres runs locally via the `postgis/postgis` Docker image. The frontend dev server proxies `/api/*` to gis-api; Supabase is not used locally by default.

## Services

| Service | Role |
|---|---|
| `gis-web` | React SPA. Direct Supabase access for reads; calls `gis-api` for computation. |
| `gis-api` | ASP.NET Core 10. Computation and analysis. Not a CRUD proxy. |
| Supabase | Managed PostgreSQL + PostGIS. Serves the API and exposes PostgREST for direct client reads. |
| Fly.io | Hosts `gis-api`. Managed ingress and TLS. |
| Cloudflare Pages | Hosts `gis-web`. CDN delivery. |
