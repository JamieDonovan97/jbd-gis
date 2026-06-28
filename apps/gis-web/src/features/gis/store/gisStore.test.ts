import { beforeEach, describe, expect, it } from 'vitest'
import { useGisStore } from './gisStore'

const initialState = useGisStore.getState()

describe('gisStore', () => {
  beforeEach(() => {
    useGisStore.setState(initialState, true)
  })

  it('toggles a tool open, then closed', () => {
    const { toggleTool } = useGisStore.getState()
    toggleTool('search')
    expect(useGisStore.getState().activeTool).toBe('search')
    toggleTool('search')
    expect(useGisStore.getState().activeTool).toBeNull()
  })

  it('switching tools replaces the active one', () => {
    useGisStore.getState().toggleTool('search')
    useGisStore.getState().toggleTool('layers')
    expect(useGisStore.getState().activeTool).toBe('layers')
  })

  it('selects and clears a feature', () => {
    const feature = { id: 1, source: 'parcels', properties: { name: 'A' } }
    useGisStore.getState().selectFeature(feature)
    expect(useGisStore.getState().selectedFeature).toEqual(feature)
    useGisStore.getState().selectFeature(null)
    expect(useGisStore.getState().selectedFeature).toBeNull()
  })

  it('toggles layer visibility', () => {
    const [first] = Object.keys(useGisStore.getState().layerVisibility)
    const before = useGisStore.getState().layerVisibility[first]
    useGisStore.getState().toggleLayer(first)
    expect(useGisStore.getState().layerVisibility[first]).toBe(!before)
  })
})
