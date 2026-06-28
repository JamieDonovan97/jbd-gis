import { Moon, Sun } from 'lucide-react'
import { GlassPanel } from '@/components/glass/GlassPanel'
import { Button } from '@/components/ui/button'
import { BASEMAPS } from '@/lib/map/basemaps'
import { cn } from '@/lib/utils'
import { useTheme } from '@/theme/useTheme'
import { useGisStore } from '../store/gisStore'

/** Bottom-left toggles: theme and basemap. */
export function ViewControls() {
  const theme = useTheme((s) => s.theme)
  const toggleTheme = useTheme((s) => s.toggle)
  const basemapId = useGisStore((s) => s.basemapId)
  const setBasemap = useGisStore((s) => s.setBasemap)

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
    </div>
  )
}
