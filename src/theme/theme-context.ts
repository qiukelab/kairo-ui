import { createContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'

/** Kept in sync with the pre-paint script in index.html. */
export const THEME_STORAGE_KEY = 'kairo-ui-theme'

export type ThemeContextValue = {
  /** What the user picked — may be `system`. */
  theme: Theme
  /** What is actually on screen right now. Never `system`. */
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
