# gis-web

React 19 frontend. TypeScript, Vite 8, Tailwind v4.

Deployed to Cloudflare Pages from the `dist/` build artifact. See [architecture overview](../../docs/architecture.md) for the full data flow.

## Run locally

```bash
npm install
npm run dev
```

Frontend at `http://localhost:5173`. The dev server proxies `/api/*` to `http://localhost:8080` — start `gis-api` separately if you need the API locally.

## Build and check

```bash
npm run typecheck
npm run lint
npm run build      # outputs to dist/
```

## Key files

| Path | Purpose |
|---|---|
| `src/main.tsx` | Application entry point |
| `src/App.tsx` | Root component |
| `vite.config.ts` | Build config and dev proxy |
| `nginx.conf` | SPA routing config for local Docker Compose |
