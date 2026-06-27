# gis-api

ASP.NET Core 10 Web API. Handles computation and analysis; not a CRUD proxy over the database.

Deployed to Fly.io. See [architecture overview](../../docs/architecture.md) for where it sits.

## Run locally

Requires [.NET 10 SDK](https://dotnet.microsoft.com/download). Start Postgres first from the repo root:

```bash
./scripts/dev.sh db
```

Then from this directory:

```bash
dotnet watch run
```

API available at `http://localhost:8080`
OpenAPI schema at `http://localhost:8080/openapi/v1.json`

## Key files

| Path | Purpose |
|---|---|
| `Program.cs` | Service registration and middleware pipeline |
| `Controllers/` | HTTP endpoints |
| `appsettings.Development.json` | Local database connection string |

## Environment

Copy `.env.example` at the repo root and adjust as needed. The API reads `ConnectionStrings__Default` from environment.
