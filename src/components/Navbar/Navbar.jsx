// Navbar component — Owner: Patrick Rucker
// Navigation toolbar with links to Search, History, and Saved pages
// Includes active page indicator and New Search button
//
// NavLink: React Router link that knows which page is active
// useNavigate: programmatic navigation (used by New Search to redirect to home)
// useRecipeContext: access shared state to clear data on New Search

import { NavLink, useNavigate } from 'react-router-dom'
import { useRecipeContext } from '../../context/RecipeContext'
import styles from './Navbar.module.css'

// Navbar renders the top navigation bar on every page.
// It contains:
//   - App name/logo (placeholder — waiting on team for final name and logo)
//   - Home link — navigates to the ingredient search page
//   - History link — navigates to previous searches page (placeholder for now)
//   - Saved Recipes link — navigates to saved recipes page (placeholder for now)
//   - New Search button — clears all current search data and navigates to home
function Navbar() {
  const { setIngredients, setRecipes, setError } = useRecipeContext()
  const navigate = useNavigate()

  // handleNewSearch clears the shared state (ingredients, recipes, errors)
  // and navigates back to the home page for a fresh search
  const handleNewSearch = () => {
    setIngredients([])
    setRecipes([])
    setError(null)
    navigate('/')
  }

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        Recipe App
      </NavLink>

      <ul className={styles.navLinks}>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/history">
            History
          </NavLink>
        </li>
        <li>
          <NavLink to="/saved">
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
