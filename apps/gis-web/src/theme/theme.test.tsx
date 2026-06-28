import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './useTheme'

describe('theme', () => {
  beforeEach(() => {
    act(() => useTheme.getState().setTheme('light'))
  })

  it('reflects the active theme on the document root', () => {
    render(
      <ThemeProvider>
        <span>app</span>
      </ThemeProvider>,
    )
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('swaps data-theme when the store toggles', () => {
    render(
      <ThemeProvider>
        <span>app</span>
      </ThemeProvider>,
    )
    act(() => useTheme.getState().toggle())
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
