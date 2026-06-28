import { create } from 'zustand'
import { DEFAULT_BASEMAP, type BasemapId } from '@/lib/map/basemaps'
import { LAYER_GROUPS, LAYER_NODES } from '../config/layers'
import type { ToolId } from '../config/tools'

export interface SelectedFeature {
  id: string | number | undefined
  source: string
  properties: Record<string, unknown>
}

interface GisState {
  /** The open tool/panel, or null when none is active. */
  activeTool: ToolId | null
  selectedFeature: SelectedFeature | null
  basemapId: BasemapId
  layerVisibility: Record<string, boolean>
  layerOpacity: Record<string, number>

  toggleTool: (tool: ToolId) => void
  closeTool: () => void
  selectFeature: (feature: SelectedFeature | null) => void
  setBasemap: (id: BasemapId) => void
  toggleLayer: (id: string) => void
  setLayerOpacity: (id: string, value: number) => void
  toggleGroup: (groupId: string) => void
}

const initialVisibility = Object.fromEntries(
  LAYER_NODES.map((n) => [n.id, n.defaultVisible]),
)
const initialOpacity = Object.fromEntries(LAYER_NODES.map((n) => [n.id, 1]))

/**
 * Client state for the GIS view. Server data is TanStack Query's concern; this
 * holds only what the user is doing — open tool, selection, basemap, layers.
 */
export const useGisStore = create<GisState>((set, get) => ({
  activeTool: null,
  selectedFeature: null,
  basemapId: DEFAULT_BASEMAP,
  layerVisibility: initialVisibility,
  layerOpacity: initialOpacity,

  toggleTool: (tool) =>
    set({ activeTool: get().activeTool === tool ? null : tool }),
  closeTool: () => set({ activeTool: null }),
  selectFeature: (feature) => set({ selectedFeature: feature }),
  setBasemap: (id) => set({ basemapId: id }),
  toggleLayer: (id) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [id]: !state.layerVisibility[id],
      },
    })),
  setLayerOpacity: (id, value) =>
    set((state) => ({ layerOpacity: { ...state.layerOpacity, [id]: value } })),
  toggleGroup: (groupId) =>
    set((state) => {
      const group = LAYER_GROUPS.find((g) => g.id === groupId)
      if (!group) return state
      const allOn = group.layers.every((l) => state.layerVisibility[l.id])
      const layerVisibility = { ...state.layerVisibility }
      for (const layer of group.layers) layerVisibility[layer.id] = !allOn
      return { layerVisibility }
    }),
}))
