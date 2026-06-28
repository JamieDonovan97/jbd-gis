import type { StyleSpecification } from 'maplibre-gl'
import type { ThemeId } from '@/theme/themes'
import { buildImageryStyle, CARTO_DARK, CARTO_LIGHT } from './styles'

export type BasemapId = 'vector' | 'imagery'

export interface BasemapDefinition {
  id: BasemapId
  label: string
  /** Resolve the MapLibre style for the active theme. */
  styleFor: (theme: ThemeId) => string | StyleSpecification
}

/**
 * Basemap registry. Add a provider by adding an entry — no component changes.
 */
export const BASEMAPS: readonly BasemapDefinition[] = [
  {
    id: 'vector',
    label: 'Map',
    styleFor: (theme) => (theme === 'dark' ? CARTO_DARK : CARTO_LIGHT),
  },
  {
    id: 'imagery',
    label: 'Imagery',
    styleFor: () => buildImageryStyle(),
  },
]

export const DEFAULT_BASEMAP: BasemapId = 'vector'

export function resolveMapStyle(
  id: BasemapId,
  theme: ThemeId,
): string | StyleSpecification {
  const basemap = BASEMAPS.find((b) => b.id === id) ?? BASEMAPS[0]
  return basemap.styleFor(theme)
}
