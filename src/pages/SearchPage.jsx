// SearchPage — Main page
// Composes SearchForm + RecipeGrid components

// --- SCRUM-18 TEMP TEST CODE — remove before final commit ---
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
        <p>fetchRecipes() returned {recipes.length} recipes — SCRUM-18 working</p>
      )}
      {!loading && recipes.length === 0 && !error && (
        <p>No recipes returned.</p>
      )}
    </div>
  )
}

export default SearchPage
