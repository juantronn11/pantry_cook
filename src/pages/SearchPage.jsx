// SearchPage — Main page
// Composes SearchForm + RecipeGrid components
import SearchForm from '../components/SearchForm/SearchForm'
import RecipeGrid from '../components/RecipeGrid/RecipeGrid'
import ExcludeIngredients from '../components/ExcludeIngredients/ExcludeIngredients'
import { useRecipeContext } from '../context/RecipeContext'
import styles from './ResultsPage.module.css'

// SCRUM-45: Sort bar appears between the search form and results grid once
// results have loaded. Wired to sortOrder/setSortOrder from RecipeContext.
function SearchPage() {
  const { recipes, loading, sortOrder, setSortOrder } = useRecipeContext()

  const showSortBar = !loading && recipes.length > 0

  return (
    <div>
      <h1>Search Recipes</h1>

      <SearchForm />

      {/* SCRUM-104: Exclude ingredients section — user can add ingredients to
          block from results. Wired to context in SCRUM-106. */}
      <ExcludeIngredients />

      {showSortBar && (
        <div className={styles.sortBar}>
          <label htmlFor="sort-select" className={styles.sortLabel}>
            Sort by:
          </label>
          <select
            id="sort-select"
            className={styles.sortSelect}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="best-match">Best Match</option>
            <option value="a-z">A – Z</option>
            <option value="fewest-missing">Fewest Missing Ingredients</option>
          </select>
        </div>
      )}

      <RecipeGrid />
    </div>
  )
}

export default SearchPage
