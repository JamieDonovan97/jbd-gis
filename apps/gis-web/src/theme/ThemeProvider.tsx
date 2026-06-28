import { useEffect, type ReactNode } from 'react'
import { useTheme } from './useTheme'

/**
 * Applies the active theme to the document root. Components never read the
 * theme directly — they consume semantic tokens, which [data-theme] resolves.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <>{children}</>
}
