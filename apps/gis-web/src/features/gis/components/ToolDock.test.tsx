import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TooltipProvider } from '@/components/ui/tooltip'
import { TOOLS } from '../config/tools'
import { ToolDock } from './ToolDock'

function renderDock(activeTool: null = null, onToolClick = vi.fn()) {
  render(
    <TooltipProvider>
      <ToolDock activeTool={activeTool} onToolClick={onToolClick} />
    </TooltipProvider>,
  )
  return { onToolClick }
}

describe('ToolDock', () => {
  it('renders one button per tool in the registry', () => {
    renderDock()
    for (const tool of TOOLS) {
      expect(
        screen.getByRole('button', { name: tool.label }),
      ).toBeInTheDocument()
    }
  })

  it('reports the id of the clicked tool', () => {
    const { onToolClick } = renderDock()
    fireEvent.click(screen.getByRole('button', { name: TOOLS[0].label }))
    expect(onToolClick).toHaveBeenCalledWith(TOOLS[0].id)
  })
})
