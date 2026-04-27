import { describe, it, expect } from 'vitest'
import { act, render, renderHook, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../../../src/context/ThemeContext'

const STORAGE_KEY = 'pantry-cook-theme'

function wrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

describe('ThemeContext', () => {
  it('returns a context value with theme and toggleTheme fields', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current).toEqual(
      expect.objectContaining({
        theme: expect.any(String),
        toggleTheme: expect.any(Function),
      }),
    )
    expect(['light', 'dark']).toContain(result.current.theme)
  })

  it("defaults theme to 'light' when localStorage is empty", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('light')
  })

  it('reads the initial theme from localStorage when a saved value is present', () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('dark')
  })

  it("toggleTheme() flips the theme field 'light' → 'dark' and persists it", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.theme).toBe('light')
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
  })

  it("toggleTheme() flips the theme field 'dark' → 'light' and persists it", () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.theme).toBe('dark')
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
  })

  it("sets the <html> data-theme attribute to the current theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    act(() => result.current.toggleTheme())
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('throws a descriptive Error when useTheme is called outside the provider', () => {
    function Consumer() {
      useTheme()
      return null
    }

    expect(() => render(<Consumer />)).toThrow(
      /useTheme must be used within a ThemeProvider/,
    )
  })

  it('provides the same value to every consumer under the provider', () => {
    function Display() {
      const { theme } = useTheme()
      return <span data-testid="theme">{theme}</span>
    }

    render(
      <ThemeProvider>
        <Display />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme').textContent).toBe('light')
  })
})
