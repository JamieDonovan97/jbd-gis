import type { StyleSpecification } from 'maplibre-gl'

/**
 * MapLibre style sources, all key-free.
 * CARTO vector basemaps ship a light (Positron) and dark (Dark Matter) pair;
 * imagery is composed as a raster style over ESRI World Imagery.
 */
export const CARTO_LIGHT =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
export const CARTO_DARK =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const ESRI = 'https://services.arcgisonline.com/ArcGIS/rest/services'

function esriTiles(service: string): string[] {
  return [`${ESRI}/${service}/MapServer/tile/{z}/{y}/{x}`]
}

/** Satellite imagery with transparent road/place label overlays on top. */
export function buildImageryStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      imagery: {
        type: 'raster',
        tiles: esriTiles('World_Imagery'),
        tileSize: 256,
        attribution: 'Imagery © Esri, Maxar, Earthstar Geographics',
      },
      transportation: {
        type: 'raster',
        tiles: esriTiles('Reference/World_Transportation'),
        tileSize: 256,
      },
      places: {
        type: 'raster',
        tiles: esriTiles('Reference/World_Boundaries_and_Places'),
        tileSize: 256,
      },
    },
    layers: [
      // White paper beneath so the faded aerial reads as a bright CAD underlay.
      {
        id: 'paper',
        type: 'background',
        paint: { 'background-color': '#ffffff' },
      },
      {
        id: 'imagery',
        type: 'raster',
        source: 'imagery',
        // ~+20% brightness, ~50% transparency — keeps overlaid vector data legible.
        paint: { 'raster-opacity': 0.5, 'raster-brightness-min': 0.2 },
      },
      { id: 'transportation', type: 'raster', source: 'transportation' },
      { id: 'places', type: 'raster', source: 'places' },
    ],
  }
}
