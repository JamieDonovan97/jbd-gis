/**
 * Vector layer sources. A layer node declares one of these; the generic
 * renderer (features/gis/components/MapLayers.tsx) queries it as GeoJSON and
 * draws it. Adding a layer is adding data, not map plumbing.
 */

export type FeatureGeometry = 'point' | 'line' | 'fill'

/** An ArcGIS feature layer queried as GeoJSON (WFS-style). */
export interface FeatureSource {
  service: string
  layerId: number
  geometry: FeatureGeometry
  color: string
}

export interface Bbox {
  west: number
  south: number
  east: number
  north: number
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
