// SearchPage — Main page
// Composes SearchForm + RecipeGrid components
import { useEffect, useState } from 'react'
import SearchForm from '../components/SearchForm/SearchForm'
import RecipeGrid from '../components/RecipeGrid/RecipeGrid'
import { useRecipeContext } from '../context/RecipeContext'
import styles from './ResultsPage.module.css'

// SCRUM-45: Sort bar appears between the search form and results grid once
// results have loaded. Wired to sortOrder/setSortOrder from RecipeContext.
function SearchPage() {
  const { recipesBackup, loading, sortOrder, setSortOrder, cookTimeFilter, setCookTimeFilter } = useRecipeContext()
  const [showSortBar, setShowSortBar] = useState(false);

  useEffect(() => {
    setShowSortBar(!loading && recipesBackup.length > 0)
  }, [loading, recipesBackup])

  return (
    <div>
      <h1>Search Recipes</h1>

      <SearchForm />

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

      {showSortBar && (
        <div className={styles.sortBar}>
          <label htmlFor='cook-time-filter-select' className={styles.sortLabel}>
            Filter by cook time:
          </label>
          <select
            id='cook-time-filter-select'
            className={styles.sortSelect}
            value={cookTimeFilter}
            onChange={(e) => setCookTimeFilter(e.target.value)}
          >
            <option value="any">Any</option>
            <option value="less-than-30">Less than 30 minutes</option>
            <option value="30-to-60">30 to 60 minutes</option>
            <option value="more-than-60">More than 60 minutes</option>
          </select>
        </div>
      )}

      <RecipeGrid />
    </div>
  )
}

export default SearchPage
