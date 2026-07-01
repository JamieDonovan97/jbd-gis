# gis-engine

The platform's offline batch tier — a Python 3.12 CLI. Runs a job to completion and exits; never a server, never on a request path. Output lands in object storage and is served as a static artifact. Python, not C#, for the geospatial batch stack (rasterio, PMTiles).

## Jobs

`build-terrain <archive.zip>` — a delivered DEM archive → Mapbox Terrain-RGB PMTiles, for MapLibre 3D terrain and contours. `--upload` publishes the result to R2 (reads `R2_ENDPOINT`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`).

### Pipeline

| Stage | In | Out |
|---|---|---|
| Extract | delivered `.zip` | 1 m DEM GeoTIFFs |
| Mosaic | adjacent DEM tiles | one GeoTIFF |
| Reproject | GeoTIFF, MGA Zone 56 | GeoTIFF, Web Mercator |
| Encode + tile | GeoTIFF | Terrain-RGB `.mbtiles` |
| Pack | `.mbtiles` | `.pmtiles` |

- **GeoTIFF** — a georeferenced raster grid; here, 1 m elevation samples. The DEM is delivered as adjacent 1 km tiles, so **mosaic** merges them into one continuous raster.
- **MBTiles** — a SQLite container of map tiles; the intermediate the encoded tiles are written into.
- **PMTiles** — a single-file, HTTP-range-served tile archive; the published artifact MapLibre reads directly.

The elevation-to-RGB encoding and the coordinate maths are in [docs/terrain-pipeline.md](docs/terrain-pipeline.md).

| Path | Holds |
|---|---|
| `src/gis_engine/cli.py` | The Typer CLI; one command per job. |
| `src/gis_engine/terrain.py` | The terrain pipeline. |
| `src/gis_engine/storage.py` | R2 (S3-compatible) publishing. |
| `src/gis_engine/config.py` | Environment-driven configuration. |
| `Dockerfile` | Run-to-completion image. |

## Container

Run-to-completion — mount the archive in and a directory out:

```bash
docker build -t gis-engine apps/gis-engine
docker run --rm -v "$PWD/archive.zip:/in/archive.zip:ro" -v "$PWD/out:/out" \
  gis-engine build-terrain /in/archive.zip --workdir /out
```

Add `--env-file .env --upload` to publish to R2.

Architecture: [ADR-005](../../docs/adr/005-compute-placement.md). Commands: [CONTRIBUTING.md](../../CONTRIBUTING.md).
