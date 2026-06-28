import { useQuery } from '@tanstack/react-query'
import { Layer, Source, useMap } from '@vis.gl/react-maplibre'
import type { FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'
import {
  arcgisFeatureUrl,
  type Bbox,
  type FeatureSource,
} from '@/lib/map/layerSources'
import { LAYERS, type LayerDefinition } from '../config/layers'
import { useGisStore } from '../store/gisStore'

/**
 * Renders the visible layers from the registry. Each layer's source kind
 * decides how it maps to MapLibre sources and layers — no per-layer code.
 */
export function MapLayers() {
  const visibility = useGisStore((s) => s.layerVisibility)
  return (
    <>
      {LAYERS.map((layer) =>
        visibility[layer.id] ? (
          <LayerView key={layer.id} layer={layer} />
        ) : null,
      )}
    </>
  )
}

function LayerView({ layer }: { layer: LayerDefinition }) {
  const { source } = layer
  switch (source.kind) {
    case 'raster':
      return (
        <Source
          id={layer.id}
          type="raster"
          tiles={source.tiles}
          tileSize={source.tileSize ?? 256}
          attribution={source.attribution}
        >
          <Layer id={layer.id} type="raster" />
        </Source>
      )
    case 'bbox-raster':
      return (
        <Source
          id={layer.id}
          type="raster"
          tiles={[source.tile]}
          tileSize={256}
          attribution={source.attribution}
        >
          <Layer
            id={layer.id}
            type="raster"
            paint={{ 'raster-opacity': 0.85 }}
          />
        </Source>
      )
    case 'feature':
      return <FeatureLayerView id={layer.id} source={source} />
  }
}

function FeatureLayerView({
  id,
  source,
}: {
  id: string
  source: FeatureSource
}) {
  const { main } = useMap()
  const [bbox, setBbox] = useState<Bbox | null>(null)

  useEffect(() => {
    if (!main) return
    const update = () => {
      const b = main.getBounds()
      setBbox({
        west: b.getWest(),
        south: b.getSouth(),
        east: b.getEast(),
        north: b.getNorth(),
      })
    }
    update()
    main.on('moveend', update)
    return () => {
      main.off('moveend', update)
    }
  }, [main])

  const query = useQuery({
    queryKey: ['feature', id, roundBbox(bbox)],
    queryFn: () =>
      fetchGeoJson(
        arcgisFeatureUrl(source.service, source.layerId, bbox as Bbox),
      ),
    enabled: bbox !== null,
    staleTime: 60_000,
  })

  if (!query.data) return null

  return (
    <Source id={id} type="geojson" data={query.data}>
      {featureLayers(id, source)}
    </Source>
  )
}

function featureLayers(id: string, source: FeatureSource) {
  switch (source.geometry) {
    case 'point':
      return (
        <Layer
          id={id}
          type="circle"
          paint={{
            'circle-radius': 5,
            'circle-color': source.color,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
          }}
        />
      )
    case 'line':
      return (
        <Layer
          id={id}
          type="line"
          paint={{ 'line-color': source.color, 'line-width': 2 }}
        />
      )
    case 'fill':
      return (
        <>
          <Layer
            id={id}
            type="fill"
            paint={{ 'fill-color': source.color, 'fill-opacity': 0.25 }}
          />
          <Layer
            id={`${id}-outline`}
            type="line"
            paint={{ 'line-color': source.color, 'line-width': 1.5 }}
          />
        </>
      )
  }
}

function roundBbox(b: Bbox | null): string {
  if (!b) return 'none'
  const r = (n: number) => n.toFixed(2)
  return `${r(b.west)},${r(b.south)},${r(b.east)},${r(b.north)}`
}

async function fetchGeoJson(url: string): Promise<FeatureCollection> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`layer query failed: ${res.status}`)
  return res.json()
}
