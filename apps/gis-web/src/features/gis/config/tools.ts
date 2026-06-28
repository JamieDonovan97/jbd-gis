import { Layers, Search, type LucideIcon } from 'lucide-react'

/**
 * Tool registry. The dock renders this list; adding a tool is adding an entry,
 * not touching the component. `id` doubles as the panel the tool opens.
 */
export type ToolId = 'search' | 'layers'

export interface ToolDefinition {
  id: ToolId
  label: string
  icon: LucideIcon
}

export const TOOLS: readonly ToolDefinition[] = [
  { id: 'search', label: 'Search', icon: Search },
  { id: 'layers', label: 'Layers', icon: Layers },
]
