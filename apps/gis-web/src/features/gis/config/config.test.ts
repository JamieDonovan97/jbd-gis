import { describe, expect, it } from 'vitest'
import { LAYER_GROUPS, LAYER_NODES } from './layers'
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

  it('layer groups have unique ids and a provider', () => {
    const ids = LAYER_GROUPS.map((group) => group.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const group of LAYER_GROUPS) {
      expect(group.label).toBeTruthy()
      expect(group.provider).toBeTruthy()
      expect(group.layers.length).toBeGreaterThan(0)
    }
  })

  it('every layer node has a unique id and a valid feature source', () => {
    const ids = LAYER_NODES.map((node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const { source, label } of LAYER_NODES) {
      expect(label).toBeTruthy()
      expect(source.service).toMatch(/^https:\/\//)
      expect(typeof source.layerId).toBe('number')
      expect(['point', 'line', 'fill']).toContain(source.geometry)
      expect(source.color).toMatch(/^#/)
    }
  })
})
