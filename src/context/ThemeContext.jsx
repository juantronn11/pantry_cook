// ThemeContext — Shared state provider for app theme (light/dark)
// Owner: Patrick Rucker
//
// Manages the theme state and persists the user's choice to localStorage.
// Applies a `data-theme` attribute to the <html> element so CSS can
// target theme-specific styles via [data-theme="dark"] selectors.
//
// Usage in any component:
//   import { useTheme } from '../context/ThemeContext'
//   const { theme, toggleTheme } = useTheme()

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pantry-cook-theme')
    return saved || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pantry-cook-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value = { theme, toggleTheme }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
