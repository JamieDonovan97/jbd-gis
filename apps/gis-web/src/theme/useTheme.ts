import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_THEME, type ThemeId } from './themes'

interface ThemeState {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  toggle: () => void
}

function systemTheme(): ThemeId {
  if (typeof window === 'undefined' || !window.matchMedia) return DEFAULT_THEME
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * App-level theme state. Persisted; seeded from the system preference until the
 * user makes an explicit choice.
 */
export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: systemTheme(),
      setTheme: (theme) => set({ theme }),
      toggle: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    { name: 'gis-theme' },
  ),
)
