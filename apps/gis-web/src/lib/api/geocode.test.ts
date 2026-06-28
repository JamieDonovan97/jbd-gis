import { describe, expect, it } from 'vitest'
import { suggestUrl } from './geocode'

describe('suggestUrl', () => {
  it('targets the QLD locator suggest endpoint', () => {
    const url = suggestUrl('64 Adelaide St')
    expect(url).toContain('QldCompositeLocator/GeocodeServer/suggest')
    expect(url).toContain('f=json')
    expect(url).toContain('text=64+Adelaide+St')
  })
})
