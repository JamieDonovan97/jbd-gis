import type { FeatureSource } from '@/lib/map/layerSources'

/**
 * Layer tree: provider → group → node. Each node is a vector source rendered
 * generically by MapLayers and individually controllable in the Layers panel.
 * Adding a layer is adding a node here.
 */
export interface LayerNode {
  id: string
  label: string
  source: FeatureSource
  defaultVisible: boolean
  /** Below this zoom the node is hidden (dense layers only resolve when close). */
  minZoom?: number
}

export interface LayerGroup {
  id: string
  label: string
  provider: string
  layers: readonly LayerNode[]
}

const QLD = 'https://spatial-gis.information.qld.gov.au/arcgis/rest/services'
const BCC = 'https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services'
const CADASTRE = `${QLD}/PlanningCadastre/LandParcelPropertyFramework/MapServer`

export const LAYER_GROUPS: readonly LayerGroup[] = [
  {
    id: 'cadastre',
    label: 'Cadastre',
    provider: 'Queensland',
    layers: [
      {
        id: 'parcels',
        label: 'Parcels',
        defaultVisible: true,
        // Dense in cities; from z16 a viewport stays under the service record cap.
        minZoom: 16,
        source: {
          service: CADASTRE,
          layerId: 4,
          geometry: 'fill',
          color: '#facc15',
        },
      },
      {
        id: 'easements',
        label: 'Easements',
        defaultVisible: false,
        minZoom: 16,
        source: {
          service: CADASTRE,
          layerId: 9,
          geometry: 'fill',
          color: '#fb923c',
        },
      },
    ],
  },
  {
    id: 'stormwater',
    label: 'Stormwater',
    provider: 'Brisbane City Council',
    layers: [
      {
        id: 'sw-pipes',
        label: 'Pipes',
        defaultVisible: true,
        minZoom: 14,
        source: {
          service: `${BCC}/Stormwater_Pipe_Existing/FeatureServer`,
          layerId: 0,
          geometry: 'line',
          color: '#38bdf8',
        },
      },
      {
        id: 'sw-manholes',
        label: 'Manholes',
        defaultVisible: true,
        // Points only resolve once zoomed in, so they never carpet the view.
        minZoom: 17,
        source: {
          service: `${BCC}/Stormwater_Manhole_Existing/FeatureServer`,
          layerId: 0,
          geometry: 'point',
          color: '#22d3ee',
        },
      },
      {
        id: 'sw-waterbodies',
        label: 'Waterbodies',
        defaultVisible: false,
        minZoom: 16,
        source: {
          service: `${BCC}/Stormwater_Waterbody_Existing/FeatureServer`,
          layerId: 0,
          geometry: 'point',
          color: '#2dd4bf',
        },
      },
    ],
  },
]

export const LAYER_NODES: readonly LayerNode[] = LAYER_GROUPS.flatMap(
  (g) => g.layers,
)

/** MapLibre layer ids that carry clickable features (used for selection). */
export const FEATURE_LAYER_IDS = LAYER_NODES.map((node) => node.id)
