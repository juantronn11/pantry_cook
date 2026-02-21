// Navbar component — Owner: Patrick Rucker
// Navigation toolbar with links to Search, History, and Saved pages
// Includes active page indicator, New Search button, and responsive hamburger menu
//
// useState: tracks whether the mobile menu is open or closed
// NavLink: React Router link that knows which page is active
// useNavigate: programmatic navigation (used by New Search to redirect to home)
// useRecipeContext: access shared state to clear data on New Search

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRecipeContext } from '../../context/RecipeContext'
import styles from './Navbar.module.css'

// Navbar renders the top navigation bar on every page.
// It contains:
//   - App name/logo (placeholder — waiting on team for final name and logo)
//   - Hamburger button — visible only on mobile, toggles the nav links open/closed
//   - Home link — navigates to the ingredient search page
//   - History link — navigates to previous searches page (placeholder for now)
//   - Saved Recipes link — navigates to saved recipes page (placeholder for now)
//   - New Search button — clears all current search data and navigates to home
function Navbar() {
  const { setIngredients, setRecipes, setError } = useRecipeContext()
  const navigate = useNavigate()

  // menuOpen controls whether the mobile nav links are visible
  // false = collapsed (default), true = expanded
  const [menuOpen, setMenuOpen] = useState(false)

  // handleNewSearch clears the shared state (ingredients, recipes, errors),
  // closes the mobile menu, and navigates back to home for a fresh search
  const handleNewSearch = () => {
    setIngredients([])
    setRecipes([])
    setError(null)
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        Recipe App
      </NavLink>

      {/* Hamburger button — hidden on desktop, shown on mobile.
          Toggles menuOpen between true and false on each click */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* navLinksOpen is applied when menuOpen is true — Step 2 will use
          this class in a media query to display the links on mobile */}
      <ul className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
        <li>
          {/* className receives { isActive } from NavLink — applies background
              highlight when this link matches the current URL */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? styles.activeLink : ''}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/history"
            className={({ isActive }) => isActive ? styles.activeLink : ''}
            onClick={() => setMenuOpen(false)}
          >
            History
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/saved"
            className={({ isActive }) => isActive ? styles.activeLink : ''}
            onClick={() => setMenuOpen(false)}
          >
            Saved Recipes
          </NavLink>
        </li>
        <li>
          <button onClick={handleNewSearch} className={styles.newSearchBtn}>
            New Search
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
