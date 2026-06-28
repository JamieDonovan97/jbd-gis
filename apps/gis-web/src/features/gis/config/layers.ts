import { arcgisExportTile, type LayerSource } from '@/lib/map/layerSources'

/**
 * Layer registry. Each layer declares a typed source; MapLayers renders it.
 * Adding a layer is adding an entry here — no component changes.
 */
export interface LayerDefinition {
  id: string
  label: string
  description: string
  defaultVisible: boolean
  source: LayerSource
}

const QLD = 'https://spatial-gis.information.qld.gov.au/arcgis/rest/services'

export const LAYERS: readonly LayerDefinition[] = [
  {
    id: 'cadastre',
    label: 'Property boundaries',
    description: 'QLD cadastral parcels',
    defaultVisible: false,
    source: {
      kind: 'bbox-raster',
      tile: arcgisExportTile(
        `${QLD}/PlanningCadastre/LandParcelPropertyFramework/MapServer`,
        4,
      ),
      attribution: 'Cadastre © State of Queensland',
    },
  },
  {
    id: 'water',
    label: 'Water infrastructure',
    description: 'QLD water storage structures',
    defaultVisible: false,
    source: {
      kind: 'feature',
      service: `${QLD}/Structure/PhysicalInfrastructure/MapServer`,
      layerId: 280,
      geometry: 'fill',
      color: '#2563eb',
    },
  },
]

/** MapLibre layer ids that carry clickable features (used for selection). */
export const FEATURE_LAYER_IDS = LAYERS.filter(
  (l) => l.source.kind === 'feature',
).map((l) => l.id)
