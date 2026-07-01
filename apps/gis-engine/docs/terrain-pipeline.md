# Terrain pipeline

How `build-terrain` turns a delivered DEM archive into Terrain-RGB PMTiles, and the maths behind the two non-obvious steps: reprojection and elevation encoding. Stage-by-stage formats are in the [README](../README.md); this covers the transforms. Implemented in [`terrain.py`](../src/gis_engine/terrain.py).

## Coordinate reference systems

- **Source — EPSG:28356** (GDA94 / MGA Zone 56). A projected grid in metres (easting, northing), read from the delivery metadata.
- **Target — EPSG:3857** (Web Mercator, metres). The CRS that XYZ / PMTiles map tiles are defined in.

The mosaic is reprojected to 3857 once, up front, bilinearly resampling the grid (`rasterio.warp`). Because the DEM then shares the tiles' CRS, each output tile is a plain pixel-window read — no per-tile warp, which is what let us cut tiles directly and drop the (broken) `rio-rgbify` dependency.

## Elevation → RGB (Mapbox Terrain-RGB)

A height `h` in metres packs into 24 bits of RGB. Encoding (`_to_rgb`), with `base = -10000`, `interval = 0.1`:

```
v = round((h - base) / interval)      # metres → integer code
v = clamp(v, 0, 2^24 - 1)
R = (v >> 16) & 0xFF
G = (v >>  8) & 0xFF
B =  v        & 0xFF
```

Decoding — what MapLibre `raster-dem` and maplibre-contour do:

```
h = -10000 + (R * 65536 + G * 256 + B) * 0.1
```

- **`base = -10000 m`** places the zero code 10 km below sea level, so every real elevation is a non-negative code after the shift.
- **`interval = 0.1 m`** is the vertical quantum. The 2²⁴ codes span `2^24 * 0.1 ≈ 1,677,721 m` (−10,000 m … +1,667,721 m) — far beyond any terrain, so the clamp never bites in practice.
- **Precision:** the DEM is 1 m data and the encoding step is 0.1 m — finer than the source — so encoding adds no quantisation error.

Worked example, `h = 50.0 m`:

```
v = (50 - (-10000)) / 0.1 = 100500
R = 100500 >> 16        = 1
G = (100500 >> 8) & 255 = 136
B = 100500 & 255        = 148
decode: (1*65536 + 136*256 + 148) * 0.1 - 10000 = 100500 * 0.1 - 10000 = 50.0 m
```

Elevation is resampled to the tile grid *before* encoding, so the RGB is exact for the resampled height. RGB values are never interpolated directly — averaging the R/G/B bytes would mix high- and low-order elevation bits into nonsense heights.

## Tiling (XYZ / Web Mercator)

At zoom `z` the world is a `2^z × 2^z` grid of 256 px tiles. `mercantile.xy_bounds(z, x, y)` gives a tile's bounds in EPSG:3857 metres; mapping those through the raster's affine transform gives the pixel window to read and resample to 256×256. Lower zooms bilinearly resample the elevation and then encode, so each zoom level is internally consistent.

Tiles fully outside the DEM footprint are skipped; partial tiles fill nodata to 0 m (a known edge simplification).

## MBTiles → PMTiles (the y-flip)

Tiles are written to an MBTiles SQLite file, then packed into PMTiles.

- **MBTiles** stores rows in **TMS** order (origin bottom-left): for an XYZ `y`, `tms_y = 2^z - 1 - y`. `_write_tile` applies this on insert.
- **PMTiles** uses XYZ order in a single, range-served file. The `pmtiles` converter performs the TMS → XYZ flip.

The intermediate is MBTiles because it is a trivial SQLite schema to write incrementally; PMTiles is the serve format because a single file is read by range request straight from object storage, with no tile server.
