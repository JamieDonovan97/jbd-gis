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

export function buildImageryStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      imagery: {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: 'Imagery © Esri, Maxar, Earthstar Geographics',
      },
    },
    layers: [{ id: 'imagery', type: 'raster', source: 'imagery' }],
  }
}
