/**
 * Layer source types. A layer declares one of these; the generic renderer
 * (features/gis/components/MapLayers.tsx) turns it into MapLibre sources and
 * layers. Adding a layer is adding data, not map plumbing.
 */

export interface RasterSource {
  kind: 'raster'
  tiles: string[]
  tileSize?: number
  attribution?: string
}

/** A raster fetched per-viewport (WMS GetMap or ArcGIS export) via the bbox token. */
export interface BboxRasterSource {
  kind: 'bbox-raster'
  tile: string
  attribution?: string
}

export type FeatureGeometry = 'point' | 'line' | 'fill'

/** Vector features queried from an ArcGIS layer as GeoJSON (WFS-style). */
export interface FeatureSource {
  kind: 'feature'
  service: string
  layerId: number
  geometry: FeatureGeometry
  color: string
}

export type LayerSource = RasterSource | BboxRasterSource | FeatureSource

export interface Bbox {
  west: number
  south: number
  east: number
  north: number
}

/**
 * A raster tile template for an ArcGIS MapServer `export`, using MapLibre's
 * `{bbox-epsg-3857}` token. Equivalent in shape to a WMS GetMap request.
 */
export function arcgisExportTile(service: string, layerId: number): string {
  return (
    `${service}/export` +
    `?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857` +
    `&size=256,256&dpi=96&format=png32&transparent=true` +
    `&layers=show:${layerId}&f=image`
  )
}

/** A GeoJSON query for an ArcGIS feature layer within a viewport envelope. */
export function arcgisFeatureUrl(
  service: string,
  layerId: number,
  bbox: Bbox,
  recordCap = 1000,
): string {
  const params = new URLSearchParams({
    where: '1=1',
    geometry: `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`,
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    outSR: '4326',
    outFields: '*',
    returnGeometry: 'true',
    resultRecordCount: String(recordCap),
    f: 'geojson',
  })
  return `${service}/${layerId}/query?${params.toString()}`
}
