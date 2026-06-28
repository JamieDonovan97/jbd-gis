import { create } from 'zustand'
import { DEFAULT_BASEMAP, type BasemapId } from '@/lib/map/basemaps'
import { LAYERS } from '../config/layers'
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

  toggleTool: (tool: ToolId) => void
  closeTool: () => void
  selectFeature: (feature: SelectedFeature | null) => void
  setBasemap: (id: BasemapId) => void
  toggleLayer: (id: string) => void
}

const initialLayerVisibility = Object.fromEntries(
  LAYERS.map((layer) => [layer.id, layer.defaultVisible]),
)

/**
 * Client state for the GIS view. Server data is TanStack Query's concern; this
 * holds only what the user is doing — open tool, selection, basemap, layers.
 */
export const useGisStore = create<GisState>((set, get) => ({
  activeTool: null,
  selectedFeature: null,
  basemapId: DEFAULT_BASEMAP,
  layerVisibility: initialLayerVisibility,

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
}))
