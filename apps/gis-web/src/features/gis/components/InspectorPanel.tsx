import { Eye, EyeOff, MousePointerSquareDashed, X } from 'lucide-react'
import { GlassPanel } from '@/components/glass/GlassPanel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { LAYERS } from '../config/layers'
import { useGisStore, type SelectedFeature } from '../store/gisStore'

/**
 * The right-hand panel. One surface, content chosen by what the user is doing:
 * an open tool wins, then a map selection, then a resting default.
 */
export function InspectorPanel() {
  const activeTool = useGisStore((s) => s.activeTool)
  const selectedFeature = useGisStore((s) => s.selectedFeature)
  const closeTool = useGisStore((s) => s.closeTool)

  const panel =
    activeTool === 'search'
      ? { title: 'Search', onClose: closeTool, body: <SearchBody /> }
      : activeTool === 'layers'
        ? { title: 'Layers', onClose: closeTool, body: <LayersBody /> }
        : selectedFeature
          ? {
              title: 'Feature',
              body: <FeatureBody feature={selectedFeature} />,
            }
          : { title: 'Inspector', body: <RestingBody /> }

  return (
    <GlassPanel className="flex h-full w-80 flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {panel.title}
        </h2>
        {panel.onClose && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={panel.onClose}
          >
            <X />
          </Button>
        )}
      </header>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-4">{panel.body}</div>
      </ScrollArea>
    </GlassPanel>
  )
}

function SearchBody() {
  return (
    <div className="space-y-3">
      <input
        type="search"
        placeholder="Search places and features…"
        className="w-full rounded-md border border-border bg-surface/40 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <p className="text-sm text-muted-foreground">
        Enter a place name or feature ID. Results will appear here.
      </p>
    </div>
  )
}

function LayersBody() {
  const visibility = useGisStore((s) => s.layerVisibility)
  const toggleLayer = useGisStore((s) => s.toggleLayer)

  return (
    <ul className="space-y-1">
      {LAYERS.map((layer) => {
        const visible = visibility[layer.id]
        return (
          <li key={layer.id}>
            <button
              type="button"
              onClick={() => toggleLayer(layer.id)}
              aria-pressed={visible}
              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-foreground/5"
            >
              {visible ? (
                <Eye className="size-4 text-accent" />
              ) : (
                <EyeOff className="size-4 text-muted-foreground" />
              )}
              <span className="flex-1">
                <span
                  className={cn(
                    'block text-sm',
                    !visible && 'text-muted-foreground',
                  )}
                >
                  {layer.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {layer.description}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function FeatureBody({ feature }: { feature: SelectedFeature }) {
  const entries = Object.entries(feature.properties)
  return (
    <div className="space-y-3">
      <Badge variant="accent">{feature.source}</Badge>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No attributes on this feature.
        </p>
      ) : (
        <dl className="space-y-2">
          {entries.map(([key, value]) => (
            <div key={key} className="grid grid-cols-[40%_60%] gap-2 text-sm">
              <dt className="truncate text-muted-foreground">{key}</dt>
              <dd className="truncate font-medium">{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

function RestingBody() {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <MousePointerSquareDashed className="size-4" />
      <p className="text-sm">Select a feature on the map to inspect it.</p>
    </div>
  )
}
