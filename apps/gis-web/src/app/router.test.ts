import { describe, expect, it } from 'vitest'
import { GisView } from '@/features/gis/GisView'
import { router } from './router'

describe('router', () => {
  it('wires the index route to the GIS view', () => {
    const indexRoute = router.routesById['/']
    expect(indexRoute).toBeDefined()
    expect(indexRoute.options.component).toBe(GisView)
  })
})
