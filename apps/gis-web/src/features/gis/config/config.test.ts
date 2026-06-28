import { describe, expect, it } from 'vitest'
import { LAYERS } from './layers'
import { TOOLS } from './tools'

// Guards the config-driven extension points: a malformed registry entry fails
// here rather than at render.

describe('config registries', () => {
  it('tools have unique ids and required fields', () => {
    const ids = TOOLS.map((tool) => tool.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const tool of TOOLS) {
      expect(tool.label).toBeTruthy()
      expect(tool.icon).toBeTruthy()
    }
  })

  it('layers have unique ids and required fields', () => {
    const ids = LAYERS.map((layer) => layer.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const layer of LAYERS) {
      expect(layer.label).toBeTruthy()
      expect(typeof layer.defaultVisible).toBe('boolean')
    }
  })
})
