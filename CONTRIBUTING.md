# Contributing

## Workflow

`main` is protected and always deployable. Don't commit to it directly — branch,
open a PR, and merge back once CI is green.

```
main ──┐
       ├─ feat/layers-endpoint ──► PR ──► squash-merge ──► main
       └─ fix/nginx-timeout    ──► PR ──► squash-merge ──► main
```

## Branch names

`type/short-kebab-description`, where `type` matches the commit types below.

```
feat/parcel-search
fix/health-timeout
docs/adr-infra
chore/bump-deps
```

## Commits

[Conventional Commits](https://www.conventionalcommits.org): `type(scope): summary`.

- **type** — `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`
- **scope** — the unit touched: `api`, `web`, `infra`, `docs` (optional)
- **summary** — imperative mood, no trailing period, ~72 chars

```
feat(api): add parcel search endpoint
fix(web): debounce the map viewport query
ci: pin actions to the node 24 runtime
```

PRs are **squash-merged**, so the PR title is the commit that lands on `main` —
keep it a valid Conventional Commit.

## Versioning

Versions are derived automatically; you don't set them per commit. The patch
number is git height and increments on every commit. Edit the `major.minor` in
[`version.json`](version.json) **only** to make a deliberate bump (e.g. `0.x → 1.0`).
See [ADR-002](docs/adr/002-tech-stack.md) for the stack and `version.json` for the
scheme (Nerdbank.GitVersioning). The API exposes the running build at `/api/version`.

## Before opening a PR

```bash
# API
dotnet build apps/gis-api -c Release
# Web
cd apps/gis-web && npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build
```

Auto-fix formatting with `npm run format`; run tests in watch mode with `npm run test:watch`.
