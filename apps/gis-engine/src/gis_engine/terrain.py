"""Terrain pipeline: a delivered DEM archive → Terrain-RGB PMTiles.

The steps mirror how the data arrives and how MapLibre consumes it: extract the
delivered zip, mosaic its DEM tiles, reproject to Web Mercator, encode elevation
as Mapbox Terrain-RGB tiles, and pack them into one PMTiles file. Everything runs
through rasterio's Python API, so the only requirement is `uv sync`.

The DEM is reprojected to EPSG:3857 up front, which is also the CRS web-mercator
tiles are defined in — so tiles are cut by reading pixel windows directly, with
no per-tile reprojection.
"""

from __future__ import annotations

import io
import sqlite3
import zipfile
from contextlib import closing
from pathlib import Path

import mercantile
import numpy as np
import rasterio
from PIL import Image
from rasterio.enums import Resampling
from rasterio.io import DatasetReader
from rasterio.merge import merge
from rasterio.warp import calculate_default_transform, reproject, transform_bounds
from rasterio.windows import from_bounds

WEB_MERCATOR = "EPSG:3857"
TILE_SIZE = 256

# Mapbox Terrain-RGB encoding: height = base + (R*65536 + G*256 + B) * interval.
# MapLibre's `raster-dem` (encoding: "mapbox") and maplibre-contour both read it.
MAPBOX_BASE = -10000.0
MAPBOX_INTERVAL = 0.1


def extract_dems(archive: Path, dest: Path) -> list[Path]:
    """Unpack the delivered archive and return its DEM GeoTIFFs."""
    with zipfile.ZipFile(archive) as zf:
        zf.extractall(dest)
    tiles = sorted(dest.rglob("*DEM*.tif")) or sorted(dest.rglob("*.tif"))
    if not tiles:
        raise FileNotFoundError(f"no DEM GeoTIFFs found in {archive}")
    return tiles


def mosaic(tiles: list[Path], dest: Path) -> Path:
    """Merge adjacent DEM tiles into one raster, keeping the source CRS."""
    sources = [rasterio.open(t) for t in tiles]
    try:
        data, transform = merge(sources)
        meta = sources[0].meta.copy()
    finally:
        for src in sources:
            src.close()
    meta.update(height=data.shape[1], width=data.shape[2], transform=transform)
    with rasterio.open(dest, "w", **meta) as dst:
        dst.write(data)
    return dest


def to_web_mercator(src_path: Path, dest: Path) -> Path:
    """Reproject a raster to Web Mercator (EPSG:3857)."""
    with rasterio.open(src_path) as src:
        transform, width, height = calculate_default_transform(
            src.crs, WEB_MERCATOR, src.width, src.height, *src.bounds
        )
        meta = src.meta.copy()
        meta.update(crs=WEB_MERCATOR, transform=transform, width=width, height=height)
        with rasterio.open(dest, "w", **meta) as dst:
            for band in range(1, src.count + 1):
                reproject(
                    source=rasterio.band(src, band),
                    destination=rasterio.band(dst, band),
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=transform,
                    dst_crs=WEB_MERCATOR,
                    resampling=Resampling.bilinear,
                )
    return dest


def encode_terrain_rgb(dem: Path, dest: Path, min_zoom: int, max_zoom: int) -> Path:
    """Tile a Web Mercator DEM into Mapbox Terrain-RGB, written as MBTiles."""
    dest.unlink(missing_ok=True)  # start fresh; SQLite would otherwise append to a prior run
    with rasterio.open(dem) as src:
        # One safe geographic transform (densify_pts >= 2) to bound the tile set.
        west, south, east, north = transform_bounds(
            src.crs, "EPSG:4326", *src.bounds, densify_pts=21
        )
        with closing(sqlite3.connect(dest)) as db:
            _init_mbtiles(db, min_zoom, max_zoom, (west, south, east, north))
            for zoom in range(min_zoom, max_zoom + 1):
                for tile in mercantile.tiles(west, south, east, north, zoom):
                    png = _render_tile(src, tile)
                    if png is not None:
                        _write_tile(db, tile, png)
            db.commit()
    return dest


def to_pmtiles(mbtiles: Path, dest: Path, max_zoom: int) -> Path:
    """Pack an MBTiles archive into a single PMTiles file."""
    from pmtiles.convert import mbtiles_to_pmtiles

    dest.unlink(missing_ok=True)
    mbtiles_to_pmtiles(str(mbtiles), str(dest), max_zoom)  # type: ignore[no-untyped-call]
    return dest


def build_terrain(archive: Path, workdir: Path, min_zoom: int, max_zoom: int) -> Path:
    """Run the full pipeline and return the PMTiles path."""
    workdir.mkdir(parents=True, exist_ok=True)
    tiles = extract_dems(archive, workdir / "extract")
    merged = mosaic(tiles, workdir / "mosaic.tif")
    reprojected = to_web_mercator(merged, workdir / "dem_3857.tif")
    mbtiles = encode_terrain_rgb(reprojected, workdir / "terrain.mbtiles", min_zoom, max_zoom)
    return to_pmtiles(mbtiles, workdir / f"{archive.stem}.pmtiles", max_zoom)


def _render_tile(src: DatasetReader, tile: mercantile.Tile) -> bytes | None:
    """Render one Terrain-RGB PNG tile, or None if it holds no data."""
    left, bottom, right, top = mercantile.xy_bounds(tile)  # EPSG:3857 metres
    window = from_bounds(left, bottom, right, top, transform=src.transform)
    fill = src.nodata if src.nodata is not None else 0.0
    elevation = src.read(
        1,
        window=window,
        out_shape=(TILE_SIZE, TILE_SIZE),
        resampling=Resampling.bilinear,
        boundless=True,
        fill_value=fill,
    )
    if src.nodata is not None:
        outside = elevation == src.nodata
        if outside.all():
            return None
        elevation = np.where(outside, 0.0, elevation)
    image = Image.fromarray(_to_rgb(elevation), mode="RGB")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def _to_rgb(elevation: np.ndarray) -> np.ndarray:
    """Encode an elevation grid as a Mapbox Terrain-RGB uint8 array."""
    scaled = np.round((elevation.astype(np.float64) - MAPBOX_BASE) / MAPBOX_INTERVAL)
    packed = np.clip(scaled, 0, 256**3 - 1).astype(np.uint32)
    red = ((packed >> 16) & 255).astype(np.uint8)
    green = ((packed >> 8) & 255).astype(np.uint8)
    blue = (packed & 255).astype(np.uint8)
    return np.stack([red, green, blue], axis=-1)


def _init_mbtiles(
    db: sqlite3.Connection, min_zoom: int, max_zoom: int, bounds: tuple[float, float, float, float]
) -> None:
    db.execute("CREATE TABLE metadata (name TEXT, value TEXT)")
    db.execute(
        "CREATE TABLE tiles "
        "(zoom_level INTEGER, tile_column INTEGER, tile_row INTEGER, tile_data BLOB)"
    )
    db.execute("CREATE UNIQUE INDEX tile_index ON tiles (zoom_level, tile_column, tile_row)")
    west, south, east, north = bounds
    metadata = {
        "name": "terrain-rgb",
        "format": "png",
        "minzoom": str(min_zoom),
        "maxzoom": str(max_zoom),
        "bounds": f"{west},{south},{east},{north}",
        "type": "baselayer",
    }
    db.executemany("INSERT INTO metadata VALUES (?, ?)", list(metadata.items()))


def _write_tile(db: sqlite3.Connection, tile: mercantile.Tile, data: bytes) -> None:
    # MBTiles stores rows in TMS order (y flipped from XYZ).
    tms_row = (1 << tile.z) - 1 - tile.y
    db.execute(
        "INSERT OR REPLACE INTO tiles VALUES (?, ?, ?, ?)",
        (tile.z, tile.x, tms_row, sqlite3.Binary(data)),
    )
