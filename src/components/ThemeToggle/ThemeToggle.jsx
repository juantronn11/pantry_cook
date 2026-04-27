// ThemeToggle component — Owner: Patrick Rucker
// Renders a sun/moon icon button that toggles between light and dark themes.
// Pulls theme state and toggle function from ThemeContext via useTheme().

import { useTheme } from '../../context/ThemeContext'
import styles from './ThemeToggle.module.css'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? '🌙' : '☀'}
    </button>
  )
}

export default ThemeToggle
