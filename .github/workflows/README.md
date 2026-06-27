# workflows

CI pipelines triggered on push to `main` and on pull requests targeting `main`.

| Workflow | Jobs |
|---|---|
| `ci.yml` | **api** — restore, build &nbsp;·&nbsp; **web** — lint, typecheck, build &nbsp;·&nbsp; **docker** — validate compose config |

All three jobs must pass before a PR can merge. The `docker` job runs after `api` and `web`.
