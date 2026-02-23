// SearchPage — Main page
// Composes SearchForm + RecipeGrid components

// TEMP TEST CODE — SCRUM-19 — remove before final PR
import { useEffect } from 'react'
import { useRecipeContext } from '../context/RecipeContext'

function SearchPage() {
  const { fetchRecipes, recipes, loading, error } = useRecipeContext()

  useEffect(() => {
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
