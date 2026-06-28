/**
 * Theme registry. A theme is a set of semantic-token values declared under a
 * [data-theme] selector in src/styles/themes.css; this is its registration.
 * Add a theme by adding a token block there and an entry here.
 */
export type ThemeId = 'light' | 'dark'

export interface ThemeDefinition {
  id: ThemeId
  label: string
}

export const THEMES: readonly ThemeDefinition[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

export const DEFAULT_THEME: ThemeId = 'light'
