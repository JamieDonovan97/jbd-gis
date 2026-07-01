from typer.testing import CliRunner

from gis_engine.cli import app

runner = CliRunner()


def test_version_command_runs() -> None:
    result = runner.invoke(app, ["version"])
    assert result.exit_code == 0
    assert result.stdout.strip()


def test_help_describes_the_batch_tier() -> None:
    result = runner.invoke(app, ["--help"])
    assert result.exit_code == 0
    assert "batch" in result.stdout.lower()


def test_build_terrain_is_registered() -> None:
    result = runner.invoke(app, ["build-terrain", "--help"])
    assert result.exit_code == 0
    assert "PMTiles" in result.stdout


def test_build_terrain_rejects_missing_archive() -> None:
    result = runner.invoke(app, ["build-terrain", "does-not-exist.zip"])
    assert result.exit_code != 0
