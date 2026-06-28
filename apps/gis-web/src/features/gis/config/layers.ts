/**
 * Layer registry. Describes the operational layers a user can toggle, kept
 * separate from the basemap. Static for now; the shape is the contract a future
 * data source fills.
 */
export interface LayerDefinition {
  id: string
  label: string
  description: string
  defaultVisible: boolean
}

export const LAYERS: readonly LayerDefinition[] = [
  {
    id: 'parcels',
    label: 'Parcels',
    description: 'Cadastral boundaries',
    defaultVisible: true,
  },
  {
    id: 'zoning',
    label: 'Zoning',
    description: 'Land-use classification',
    defaultVisible: false,
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    description: 'Utilities and services',
    defaultVisible: false,
  },
]
