# Architecture overview

## Production topology

```
Cloudflare Pages (gis-web)
  ├── → External layer services  (basemaps, tiles, REST/WMS — read directly)
  └── → Fly.io gis-api           (computation; storage for data we own)
               └── → Supabase PostgreSQL + PostGIS
```

Layer data is read directly from its source, the same way the imagery basemap is. Supabase and the API come in only for data we own or server-side logic — not to proxy public sources.

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
| `gis-web` | React SPA. Reads layer data directly from its source; uses `gis-api`/Supabase only for owned data or computation. |
| `gis-api` | ASP.NET Core 10. Computation and analysis. Not a CRUD proxy. |
| Supabase | Managed PostgreSQL + PostGIS for data we own. Backs the API; can expose PostgREST for direct reads of owned data. |
| Fly.io | Hosts `gis-api`. Managed ingress and TLS. |
| Cloudflare Pages | Hosts `gis-web`. CDN delivery. |
