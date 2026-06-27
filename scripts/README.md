# scripts

Developer utilities. Run from the repo root.

| Script | Purpose |
|---|---|
| `dev.sh` | Start individual services locally (`db`, `api`, `web`, `up`, `down`) |
| `update-structure.sh` | Regenerate `docs/structure.md` from the current file tree |

## dev.sh

```bash
./scripts/dev.sh db      # Postgres in Docker
./scripts/dev.sh api     # dotnet watch run
./scripts/dev.sh web     # npm run dev
./scripts/dev.sh up      # full stack via Docker Compose
./scripts/dev.sh down    # stop Docker Compose
```
