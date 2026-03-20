import RecipeGrid from '../components/RecipeGrid/RecipeGrid'
import { useRecipeContext } from '../context/RecipeContext'
import styles from './ResultsPage.module.css'

// SCRUM-45: ResultsPage now includes a sort bar that lets the user reorder
// recipe results without triggering a new search. The sort dropdown is only
// rendered when there are results to sort (hidden while loading or empty).
function ResultsPage() {
  const { recipes, loading, sortOrder, setSortOrder } = useRecipeContext()

  const showSortBar = !loading && recipes.length > 0

  return (
    <div>
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

export default ResultsPage
