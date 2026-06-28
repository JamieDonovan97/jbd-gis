import { Outlet } from '@tanstack/react-router'

/**
 * The application shell. Global chrome (e.g. a top menu) mounts here, around
 * the active view. Today it is a thin frame; the structure is what matters.
 */
export function AppShell() {
  return (
    <div className="h-full w-full">
      {/* global chrome slot — reserved */}
      <Outlet />
    </div>
  )
}
