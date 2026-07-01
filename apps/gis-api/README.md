# gis-api

The platform's request-time service — ASP.NET Core 10, deployed to Fly.io. Live, per-request computation. A stub today: health and version endpoints only.

| Path | Holds |
|---|---|
| `Program.cs` | Service registration and the middleware pipeline. |
| `Controllers/` | HTTP endpoints. |
| `appsettings*.json` | Configuration; local connection string in `appsettings.Development.json`. |

Architecture: [ADR-005](../../docs/adr/005-compute-placement.md), [architecture.md](../../docs/architecture.md). Commands: [CONTRIBUTING.md](../../CONTRIBUTING.md).
