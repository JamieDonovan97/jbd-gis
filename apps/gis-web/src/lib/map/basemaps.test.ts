import { describe, expect, it } from 'vitest'
import { BASEMAPS, resolveMapStyle } from './basemaps'

describe('basemaps registry', () => {
  it('has unique ids', () => {
    const ids = BASEMAPS.map((basemap) => basemap.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('resolves a style for every basemap in both themes', () => {
    for (const basemap of BASEMAPS) {
      expect(resolveMapStyle(basemap.id, 'light')).toBeTruthy()
      expect(resolveMapStyle(basemap.id, 'dark')).toBeTruthy()
    }
  })

  it('falls back to the first basemap for an unknown id', () => {
    // @ts-expect-error exercising the runtime guard with an invalid id
    expect(resolveMapStyle('nope', 'light')).toBe(BASEMAPS[0].styleFor('light'))
  })
})
