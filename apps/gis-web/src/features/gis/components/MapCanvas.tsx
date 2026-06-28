import { Map, type MapLayerMouseEvent } from '@vis.gl/react-maplibre'
import type { StyleSpecification } from 'maplibre-gl'
import type { ReactNode } from 'react'
import { FEATURE_LAYER_IDS } from '../config/layers'
import type { SelectedFeature } from '../store/gisStore'

interface MapCanvasProps {
  mapStyle: string | StyleSpecification
  onSelect: (feature: SelectedFeature | null) => void
  children?: ReactNode
}

// Brisbane — the fallback entry point when geolocation is unavailable.
const BRISBANE = { longitude: 153.0251, latitude: -27.4698, zoom: 11 }

/** The full-viewport map — the backing layer everything else floats over. */
export function MapCanvas({ mapStyle, onSelect, children }: MapCanvasProps) {
  function handleClick(e: MapLayerMouseEvent) {
    const rendered = e.target.queryRenderedFeatures(e.point)
    // Prefer our own feature layers; fall back to any feature with attributes.
    const hit =
      rendered.find((f) => FEATURE_LAYER_IDS.includes(f.layer.id)) ??
      rendered.find((f) => f.properties && Object.keys(f.properties).length > 0)
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

  return (
    <Map
      id="main"
      initialViewState={BRISBANE}
      mapStyle={mapStyle}
      onClick={handleClick}
      onLoad={(e) => {
        // Centre on the user's location if granted; otherwise stay on Brisbane.
        navigator.geolocation?.getCurrentPosition(
          (pos) =>
            e.target.flyTo({
              center: [pos.coords.longitude, pos.coords.latitude],
              zoom: 13,
            }),
          undefined,
          { timeout: 5000 },
        )
      }}
      attributionControl={{ compact: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {children}
    </Map>
  )
}
