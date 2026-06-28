import { describe, expect, it } from 'vitest'
import { arcgisFeatureUrl } from './layerSources'

describe('arcgisFeatureUrl', () => {
  it('builds a GeoJSON feature query within a bbox', () => {
    const url = arcgisFeatureUrl(
      'https://example/MapServer',
      280,
      { west: 1, south: 2, east: 3, north: 4 },
      500,
    )
    expect(url).toContain('/280/query')
    expect(url).toContain('f=geojson')
    expect(url).toContain('resultRecordCount=500')
    expect(url).toContain('geometry=1%2C2%2C3%2C4')
  })
})
