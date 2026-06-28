import { Map, type MapLayerMouseEvent } from '@vis.gl/react-maplibre'
import type { Map as MaplibreMap, StyleSpecification } from 'maplibre-gl'
import type { ReactNode } from 'react'
import { FEATURE_LAYER_IDS } from '../config/layers'
import type { SelectedFeature } from '../store/gisStore'

interface MapCanvasProps {
  mapStyle: string | StyleSpecification
  onSelect: (feature: SelectedFeature | null) => void
  children?: ReactNode
}

// Brisbane — the fallback entry point when geolocation is unavailable.
const BRISBANE = { longitude: 153.0251, latitude: -27.4698, zoom: 16 }

/** Feature layers currently present in the style (toggled on). */
function activeFeatureLayers(map: MaplibreMap): string[] {
  return FEATURE_LAYER_IDS.filter((id) => map.getLayer(id))
}

/** The full-viewport map — the backing layer everything else floats over. */
export function MapCanvas({ mapStyle, onSelect, children }: MapCanvasProps) {
  function handleClick(e: MapLayerMouseEvent) {
    // Only our data layers are selectable — never basemap cartography.
    const layers = activeFeatureLayers(e.target)
    const hit = layers.length
      ? e.target.queryRenderedFeatures(e.point, { layers })[0]
      : undefined
    onSelect(
      hit
        ? {
            id: hit.id,
            source: typeof hit.source === 'string' ? hit.source : 'map',
            properties: hit.properties ?? {},
          }
        : null,
    )
  }

  function handleMouseMove(e: MapLayerMouseEvent) {
    const layers = activeFeatureLayers(e.target)
    const over =
      layers.length > 0 &&
      e.target.queryRenderedFeatures(e.point, { layers }).length > 0
    e.target.getCanvas().style.cursor = over ? 'pointer' : ''
  }

  return (
    <Map
      id="main"
      initialViewState={BRISBANE}
      mapStyle={mapStyle}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      attributionControl={false}
      style={{ position: 'absolute', inset: 0 }}
    >
      {children}
    </Map>
  )
}
