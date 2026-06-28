import { useMap } from '@vis.gl/react-maplibre'
import { Minus, Navigation, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GlassPanel } from '@/components/glass/GlassPanel'
import { Button } from '@/components/ui/button'

/**
 * Map navigation: zoom, and a compass that tracks bearing and resets north and
 * pitch on click.
 */
export function MapControls() {
  const { main } = useMap()
  const [bearing, setBearing] = useState(0)

  useEffect(() => {
    if (!main) return
    const sync = () => setBearing(main.getBearing())
    main.on('rotate', sync)
    sync()
    return () => {
      main.off('rotate', sync)
    }
  }, [main])

  return (
    <GlassPanel className="flex flex-col p-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom in"
        onClick={() => main?.zoomIn()}
      >
        <Plus />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom out"
        onClick={() => main?.zoomOut()}
      >
        <Minus />
      </Button>
      <span className="my-1 h-px w-full bg-glass-border" />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Reset north"
        onClick={() => main?.resetNorthPitch({ duration: 400 })}
      >
        <Navigation
          className="text-accent"
          style={{ transform: `rotate(${-bearing}deg)` }}
        />
      </Button>
    </GlassPanel>
  )
}
