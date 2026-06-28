import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Layer, Source, useMap } from '@vis.gl/react-maplibre'
import type { FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'
import { arcgisFeatureUrl, type Bbox } from '@/lib/map/layerSources'
import { LAYER_NODES, type LayerNode } from '../config/layers'
import { useGisStore } from '../store/gisStore'

// The service's maxRecordCount; from the layers' minZoom a viewport stays under it.
const RECORD_CAP = 4000

/**
 * Renders the visible layer nodes from the registry. Each node is a vector
 * source queried per-viewport and drawn by geometry — no per-layer code.
 * Point layers are clustered so dense data stays legible.
 */
export function MapLayers() {
  const visibility = useGisStore((s) => s.layerVisibility)
  return (
    <>
      {LAYER_NODES.filter((node) => visibility[node.id]).map((node) => (
        <FeatureLayer key={node.id} node={node} />
      ))}
    </>
  )
}

interface MapView {
  bbox: Bbox
  zoom: number
}

function FeatureLayer({ node }: { node: LayerNode }) {
  const { main } = useMap()
  const opacity = useGisStore((s) => s.layerOpacity[node.id] ?? 1)
  const [view, setView] = useState<MapView | null>(null)

  useEffect(() => {
    if (!main) return
    const update = () => {
      const b = main.getBounds()
      setView({
        bbox: {
          west: b.getWest(),
          south: b.getSouth(),
          east: b.getEast(),
          north: b.getNorth(),
        },
        zoom: main.getZoom(),
      })
    }
    update()
    main.on('moveend', update)
    return () => {
      main.off('moveend', update)
    }
  }, [main])

  const inRange = view !== null && view.zoom >= (node.minZoom ?? 0)

  const query = useQuery({
    queryKey: ['feature', node.id, roundBbox(view?.bbox ?? null)],
    queryFn: () =>
      fetchGeoJson(
        arcgisFeatureUrl(
          node.source.service,
          node.source.layerId,
          view!.bbox,
          RECORD_CAP,
        ),
      ),
    enabled: inRange,
    placeholderData: keepPreviousData, // keep features on screen while the next area loads
    staleTime: 60_000,
  })

  if (!inRange || !query.data) return null

  return (
    <Source id={node.id} type="geojson" data={query.data}>
      {featureLayers(node, opacity)}
    </Source>
  )
}

function featureLayers(node: LayerNode, opacity: number) {
  const { id, source } = node
  const color = source.color
  switch (source.geometry) {
    case 'point':
      return [
        <Layer
          key="point"
          id={id}
          type="circle"
          paint={{
            'circle-radius': 5,
            'circle-color': color,
            'circle-opacity': opacity,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': opacity,
          }}
        />,
      ]
    case 'line':
      return [
        <Layer
          key="line"
          id={id}
          type="line"
          paint={{
            'line-color': color,
            'line-width': 2.5,
            'line-opacity': opacity,
          }}
        />,
      ]
    case 'fill':
      return [
        <Layer
          key="fill"
          id={id}
          type="fill"
          paint={{ 'fill-color': color, 'fill-opacity': 0.12 * opacity }}
        />,
        <Layer
          key="outline"
          id={`${id}-outline`}
          type="line"
          paint={{
            'line-color': color,
            'line-width': 1.8,
            'line-opacity': opacity,
          }}
        />,
      ]
  }
}

// ~100 m precision: tracks the view closely so coverage follows the map, while
// still de-duplicating sub-block jitter.
function roundBbox(b: Bbox | null): string {
  if (!b) return 'none'
  const r = (n: number) => n.toFixed(3)
  return `${r(b.west)},${r(b.south)},${r(b.east)},${r(b.north)}`
}

async function fetchGeoJson(url: string): Promise<FeatureCollection> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`layer query failed: ${res.status}`)
  return res.json()
}
