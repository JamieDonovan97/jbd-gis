# workflows

| Workflow | Trigger | Jobs |
|---|---|---|
| `ci.yml` | push to `main`, PRs to `main` | **api** — restore, build &nbsp;·&nbsp; **web** — format, lint, typecheck, test, build &nbsp;·&nbsp; **engine** — format, lint, typecheck, test &nbsp;·&nbsp; **docker** — validate compose config, build engine image |
| `deploy.yml` | push to `main` | **pages** — build `gis-web` and deploy to Cloudflare Pages; a no-op until the Cloudflare secrets exist |

Every `ci.yml` job must pass before a PR can merge; `docker` runs after `api`, `web`, and `engine`.
