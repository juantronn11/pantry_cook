// SearchPage — Main page
// Composes SearchForm + RecipeGrid components

// TEMP TEST CODE — SCRUM-19 — remove before final PR
// API call still fires on load so you can inspect results in DevTools:
//   Network tab → Fetch/XHR — confirm both MealDB and Spoonacular calls fired
//   Console tab — recipes array logged below shows normalized shape (id, name, source, raw)
import { useEffect, useRef } from 'react'
import { useRecipeContext } from '../context/RecipeContext'

function SearchPage() {
  const { fetchRecipes, recipes } = useRecipeContext()

  // useRef guard prevents StrictMode from firing fetchRecipes twice in dev.
  // Remove this ref along with the useEffect below when cleaning up.
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchRecipes(['chicken', 'garlic']).then(() => {
      console.log('SCRUM-19 test — recipes in context:', recipes)
    })
  }, [])

  return (
    <div>
      <h1>Search Recipes</h1>
      <p>SearchPage placeholder — will contain SearchForm and RecipeGrid</p>
    </div>
  )
}

export default SearchPage
