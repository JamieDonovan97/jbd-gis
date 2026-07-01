import { Layer, Source, useMap } from '@vis.gl/react-maplibre'
import { useEffect } from 'react'
import { TERRAIN, TERRAIN_SOURCE_ID } from '@/lib/map/terrain'
import { useGisStore } from '../store/gisStore'

/**
 * The Terrain-RGB DEM. A subtle hillshade is always drawn; enabling 3D deforms
 * the map into relief and tilts the camera so it reads. The elevation source is
 * a PMTiles archive on R2 (see apps/gis-engine).
 */
export function TerrainLayer() {
  const { main } = useMap()
  const terrain3d = useGisStore((s) => s.terrain3d)

  useEffect(() => {
    if (!main || !TERRAIN) return
    const map = main.getMap()
    const cfg = TERRAIN

    const apply = () => {
      if (!map.getSource(TERRAIN_SOURCE_ID)) return
      if (terrain3d) {
        map.setTerrain({
          source: TERRAIN_SOURCE_ID,
          exaggeration: cfg.exaggeration,
        })
        if (map.getPitch() < 20) map.easeTo({ pitch: 60, duration: 600 })
      } else {
        map.setTerrain(null)
        if (map.getPitch() > 0) map.easeTo({ pitch: 0, duration: 600 })
      }
    }

    apply()
    // A basemap swap reloads the style and drops imperative terrain — reapply.
    map.on('style.load', apply)
    return () => {
      map.off('style.load', apply)
    }
  }, [main, terrain3d])

  if (!TERRAIN) return null

  return (
    <Source
      id={TERRAIN_SOURCE_ID}
      type="raster-dem"
      url={TERRAIN.url}
      tileSize={TERRAIN.tileSize}
      maxzoom={TERRAIN.maxzoom}
      encoding={TERRAIN.encoding}
    >
      <Layer
        id="terrain-hillshade"
        type="hillshade"
        paint={{ 'hillshade-exaggeration': 0.4 }}
      />
    </Source>
  )
}
