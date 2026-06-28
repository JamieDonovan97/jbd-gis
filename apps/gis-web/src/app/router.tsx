import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { GisView } from '@/features/gis/GisView'
import { AppShell } from './shell/AppShell'

const rootRoute = createRootRoute({ component: AppShell })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: GisView,
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
