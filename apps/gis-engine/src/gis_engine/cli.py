"""gis-engine command line.

One command per batch job. A job runs to completion, writes its output to
storage, and exits — it is never a server and never sits on a request path.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Annotated

import typer

app = typer.Typer(
    name="gis-engine",
    help="Offline batch computation. Runs a job to completion and exits.",
    no_args_is_help=True,
    add_completion=False,
)


def _version() -> str:
    """major.minor from the repo's single version source (``version.json``).

    Patch is git height in the .NET and web builds (Nerdbank.GitVersioning) and
    is not reproduced here. Returns ``"unknown"`` when the source is out of
    reach, e.g. inside a container built from this app's directory alone.
    """
    try:
        version_file = Path(__file__).resolve().parents[4] / "version.json"
        return str(json.loads(version_file.read_text())["version"])
    except (OSError, KeyError, IndexError, json.JSONDecodeError):
        return "unknown"


@app.command()
def version() -> None:
    """Print the engine version."""
    typer.echo(_version())


@app.command()
def build_terrain(
    archive: Annotated[
        Path,
        typer.Argument(
            exists=True, dir_okay=False, help="Delivered DEM archive (.zip), as received."
        ),
    ],
    min_zoom: Annotated[int, typer.Option("--min-zoom")] = 10,
    max_zoom: Annotated[int, typer.Option("--max-zoom")] = 15,
    workdir: Annotated[Path, typer.Option("--workdir", help="Scratch directory.")] = Path(
        "data/work"
    ),
    upload: Annotated[bool, typer.Option("--upload", help="Publish the PMTiles to R2.")] = False,
    key: Annotated[
        str | None, typer.Option("--key", help="R2 object key; defaults to the file name.")
    ] = None,
) -> None:
    """Turn a delivered DEM archive into Terrain-RGB PMTiles."""
    from . import storage, terrain
    from .config import R2Config

    typer.echo(f"building terrain from {archive.name} (z{min_zoom}–{max_zoom})")
    pmtiles = terrain.build_terrain(archive, workdir, min_zoom, max_zoom)
    typer.echo(f"wrote {pmtiles} ({pmtiles.stat().st_size / 1e6:.1f} MB)")

    if upload:
        cfg = R2Config.from_env()
        if cfg is None:
            raise typer.BadParameter(
                "R2 credentials unset (R2_ENDPOINT, R2_BUCKET, "
                "R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)."
            )
        url = storage.upload(pmtiles, key or pmtiles.name, cfg)
        typer.echo(f"uploaded → {url}")


def main() -> None:
    """Console-script entry point."""
    from dotenv import find_dotenv, load_dotenv

    load_dotenv(find_dotenv(usecwd=True))
    app()
