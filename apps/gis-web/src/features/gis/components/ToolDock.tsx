import { GlassPanel } from '@/components/glass/GlassPanel'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TOOLS, type ToolId } from '../config/tools'

interface ToolDockProps {
  activeTool: ToolId | null
  onToolClick: (id: ToolId) => void
}

/** Logo and the tool buttons, rendered straight from the TOOLS registry. */
export function ToolDock({ activeTool, onToolClick }: ToolDockProps) {
  return (
    <GlassPanel className="flex items-center gap-1 px-2 py-1.5">
      <span className="select-none px-2 text-sm font-semibold tracking-tight">
        GIS
      </span>
      <span className="mx-1 h-6 w-px bg-glass-border" />
      {TOOLS.map((tool) => {
        const Icon = tool.icon
        const active = activeTool === tool.id
        return (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-circle"
                aria-label={tool.label}
                aria-pressed={active}
                onClick={() => onToolClick(tool.id)}
                className={cn(
                  active && 'bg-accent/15 text-accent ring-1 ring-accent/40',
                )}
              >
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{tool.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </GlassPanel>
  )
}
