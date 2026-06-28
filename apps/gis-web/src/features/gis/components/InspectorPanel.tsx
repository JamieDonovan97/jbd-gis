import { useQuery } from '@tanstack/react-query'
import { useMap } from '@vis.gl/react-maplibre'
import { Eye, EyeOff, MousePointerSquareDashed, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GlassPanel } from '@/components/glass/GlassPanel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  locateAddress,
  suggestAddresses,
  type AddressSuggestion,
} from '@/lib/api/geocode'
import { cn } from '@/lib/utils'
import { LAYER_GROUPS } from '../config/layers'
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
      <header className="flex h-14 shrink-0 items-center justify-between px-4">
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
  const { main } = useMap()
  const [term, setTerm] = useState('')
  const [debounced, setDebounced] = useState('')

  // Debounce typing so we suggest as the user types without a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 350)
    return () => clearTimeout(timer)
  }, [term])

  const suggestions = useQuery({
    queryKey: ['suggest', debounced],
    queryFn: () => suggestAddresses(debounced),
    enabled: debounced.length >= 3,
    staleTime: 5 * 60_000,
  })

  async function goTo(suggestion: AddressSuggestion) {
    const result = await locateAddress(suggestion.magicKey)
    if (result) main?.flyTo({ center: [result.lon, result.lat], zoom: 17 })
  }

  const noMatches =
    debounced.length >= 3 &&
    !suggestions.isFetching &&
    suggestions.data?.length === 0

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search a Queensland address…"
        className="w-full rounded-md border border-border bg-surface/40 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {suggestions.isFetching && (
        <p className="text-sm text-muted-foreground">Searching…</p>
      )}
      {noMatches && (
        <p className="text-sm text-muted-foreground">No matches.</p>
      )}

      <ul className="space-y-1">
        {suggestions.data?.map((suggestion) => (
          <li key={suggestion.magicKey}>
            <button
              type="button"
              onClick={() => goTo(suggestion)}
              className="w-full rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-foreground/5"
            >
              {suggestion.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function LayersBody() {
  const visibility = useGisStore((s) => s.layerVisibility)
  const opacity = useGisStore((s) => s.layerOpacity)
  const toggleLayer = useGisStore((s) => s.toggleLayer)
  const setLayerOpacity = useGisStore((s) => s.setLayerOpacity)
  const toggleGroup = useGisStore((s) => s.toggleGroup)

  return (
    <div className="space-y-4">
      {LAYER_GROUPS.map((group) => {
        const anyOn = group.layers.some((l) => visibility[l.id])
        return (
          <div key={group.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-pressed={anyOn}
                aria-label={`Toggle ${group.label}`}
                className="text-foreground/70 hover:text-foreground"
              >
                {anyOn ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
              </button>
              <div className="flex-1">
                <div className="text-sm font-medium">{group.label}</div>
                <div className="text-xs text-muted-foreground">
                  {group.provider}
                </div>
              </div>
            </div>

            <ul className="space-y-1 border-l border-border pl-3">
              {group.layers.map((node) => {
                const on = visibility[node.id]
                return (
                  <li key={node.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleLayer(node.id)}
                      aria-pressed={on}
                      aria-label={node.label}
                    >
                      {on ? (
                        <Eye className="size-4 text-accent" />
                      ) : (
                        <EyeOff className="size-4 text-muted-foreground" />
                      )}
                    </button>
                    <span
                      className={cn(
                        'flex-1 text-sm',
                        !on && 'text-muted-foreground',
                      )}
                    >
                      {node.label}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={opacity[node.id] ?? 1}
                      onChange={(e) =>
                        setLayerOpacity(node.id, Number(e.target.value))
                      }
                      disabled={!on}
                      aria-label={`${node.label} opacity`}
                      className="h-1 w-16 accent-accent disabled:opacity-40"
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
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
