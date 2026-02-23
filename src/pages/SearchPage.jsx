// SearchPage — Main page
// Composes SearchForm + RecipeGrid components

// TEMP TEST CODE — SCRUM-19 — remove before final PR
import { useEffect, useRef } from 'react'
import { useRecipeContext } from '../context/RecipeContext'

function SearchPage() {
  const { fetchRecipes, recipes, loading, error } = useRecipeContext()

  // useRef guard prevents React StrictMode from firing fetchRecipes twice.
  // StrictMode intentionally mounts → unmounts → remounts in dev, which causes
  // useEffect to run twice and doubles every API call, burning Spoonacular quota fast.
  // The ref persists across the simulated remount so the second call is blocked.
  // Remove this ref along with the rest of the temp test code.
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchRecipes(['chicken', 'garlic'])
  }, [])

  return (
    <div>
      <h1>Search Recipes</h1>
      <p>SearchPage placeholder — will contain SearchForm and RecipeGrid</p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && recipes.length > 0 && (
        <div>
          <p>fetchRecipes() returned {recipes.length} deduplicated recipes — SCRUM-19 working</p>
          <p>Sources: {[...new Set(recipes.map(r => r.source))].join(', ')}</p>
          <p>First result: {recipes[0]?.name} (from {recipes[0]?.source})</p>
        </div>
      )}
      {!loading && recipes.length === 0 && !error && (
        <p>No recipes returned.</p>
      )}
    </div>
  )
}

export default SearchPage
