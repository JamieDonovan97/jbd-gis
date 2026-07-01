# apps

Deployable application units. Each is independently buildable and deployable.

| App | Stack | Deployed to |
|---|---|---|
| [gis-api](gis-api/) | ASP.NET Core 10, C# | Fly.io |
| [gis-web](gis-web/) | React 19, TypeScript, Vite | Cloudflare Pages |
| [gis-engine](gis-engine/) | Python 3.12, Typer | Fly Machines (batch) |

See [docs/architecture.md](../docs/architecture.md) for how they relate at runtime.
