import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GlassPanel } from './GlassPanel'

describe('GlassPanel', () => {
  it('applies the shared glass recipe', () => {
    const { container } = render(<GlassPanel>content</GlassPanel>)
    const el = container.firstElementChild
    expect(el).toHaveClass('bg-glass')
    expect(el).toHaveClass('backdrop-blur-xl')
  })
})
