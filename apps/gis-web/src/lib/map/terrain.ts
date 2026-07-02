/**
 * Terrain-RGB DEM config. The elevation grid is a PMTiles archive on R2, built
 * by apps/gis-engine. Its URL is environment-driven; when unset, terrain is off.
 */

export interface TerrainConfig {
  /** `pmtiles://`-prefixed source URL. */
  url: string
  encoding: 'mapbox' | 'terrarium'
  tileSize: number
  maxzoom: number
  exaggeration: number
}

export const TERRAIN_SOURCE_ID = 'terrain-dem'

const url = import.meta.env.VITE_TERRAIN_PMTILES_URL as string | undefined

export const TERRAIN: TerrainConfig | null = url
  ? {
      url: `pmtiles://${url}`,
      encoding: 'mapbox', // matches the engine's Mapbox Terrain-RGB output
      tileSize: 256, // matches the engine's 256 px tiles
      maxzoom: 15,
      // Brisbane's CBD is nearly flat (~0–80 m over kilometres); real relief
      // needs heavy exaggeration to read on the web map.
      exaggeration: 3,
    }
  : null
