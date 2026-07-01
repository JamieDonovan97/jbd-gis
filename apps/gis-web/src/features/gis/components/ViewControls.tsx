import { Moon, Mountain, Sun } from 'lucide-react'
import { GlassPanel } from '@/components/glass/GlassPanel'
import { Button } from '@/components/ui/button'
import { BASEMAPS } from '@/lib/map/basemaps'
import { TERRAIN } from '@/lib/map/terrain'
import { cn } from '@/lib/utils'
import { useTheme } from '@/theme/useTheme'
import { useGisStore } from '../store/gisStore'

/** Bottom-left toggles: theme and basemap. */
export function ViewControls() {
  const theme = useTheme((s) => s.theme)
  const toggleTheme = useTheme((s) => s.toggle)
  const basemapId = useGisStore((s) => s.basemapId)
  const setBasemap = useGisStore((s) => s.setBasemap)
  const terrain3d = useGisStore((s) => s.terrain3d)
  const toggleTerrain3d = useGisStore((s) => s.toggleTerrain3d)

  return (
    <div className="flex items-center gap-2">
      <GlassPanel className="p-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Moon /> : <Sun />}
        </Button>
      </GlassPanel>

      <GlassPanel className="flex p-1" role="group" aria-label="Basemap">
        {BASEMAPS.map((basemap) => {
          const active = basemap.id === basemapId
          return (
            <button
              key={basemap.id}
              type="button"
              aria-pressed={active}
              onClick={() => setBasemap(basemap.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent/15 text-accent'
                  : 'text-foreground hover:bg-foreground/5',
              )}
            >
              {basemap.label}
            </button>
          )
        })}
      </GlassPanel>

      {TERRAIN && (
        <GlassPanel className="p-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle 3D terrain"
            aria-pressed={terrain3d}
            onClick={toggleTerrain3d}
            className={cn(terrain3d && 'text-accent')}
          >
            <Mountain />
          </Button>
        </GlassPanel>
      )}
    </div>
  )
}
