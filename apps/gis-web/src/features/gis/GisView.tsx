import { MapProvider } from '@vis.gl/react-maplibre'
import { useMemo } from 'react'
import { resolveMapStyle } from '@/lib/map/basemaps'
import { useTheme } from '@/theme/useTheme'
import { InspectorPanel } from './components/InspectorPanel'
import { MapCanvas } from './components/MapCanvas'
import { MapControls } from './components/MapControls'
import { ToolDock } from './components/ToolDock'
import { ViewControls } from './components/ViewControls'
import { useGisStore } from './store/gisStore'

/**
 * The GIS view: a full-screen map with floating controls layered over it.
 * One route among potentially many; it owns no global chrome.
 */
export function GisView() {
  const theme = useTheme((s) => s.theme)
  const basemapId = useGisStore((s) => s.basemapId)
  const activeTool = useGisStore((s) => s.activeTool)
  const toggleTool = useGisStore((s) => s.toggleTool)
  const selectFeature = useGisStore((s) => s.selectFeature)

  const mapStyle = useMemo(
    () => resolveMapStyle(basemapId, theme),
    [basemapId, theme],
  )

  return (
    <MapProvider>
      <div className="relative h-full w-full overflow-hidden">
        <MapCanvas mapStyle={mapStyle} onSelect={selectFeature} />

        <div className="absolute left-4 top-4">
          <ToolDock activeTool={activeTool} onToolClick={toggleTool} />
        </div>

        <div className="absolute bottom-4 right-[22rem]">
          <MapControls />
        </div>

        <div className="absolute bottom-4 right-4 top-4">
          <InspectorPanel />
        </div>

        <div className="absolute bottom-4 left-4">
          <ViewControls />
        </div>
      </div>
    </MapProvider>
  )
}
