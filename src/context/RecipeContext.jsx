// RecipeContext — Shared state provider for the Recipe App
//
// This file creates a React Context that holds the app's shared state
// so that multiple components can access the same data without
// passing props through every level of the component tree.
//
// Shared state:
//   - ingredients (array)  — selected ingredients from SearchForm
//   - recipes (array)      — normalized recipe results from both APIs
//   - loading (boolean)    — true while API calls are in progress
//   - error (string|null)  — set if one or both API calls fail
//
// Recipe shape in context:
//   { id, name, source, ingredients[], raw }
//
// Usage in any component:
//   import { useRecipeContext } from '../context/RecipeContext'
//   const { recipes, loading, fetchRecipes } = useRecipeContext()

import { createContext, useContext, useState } from 'react'
import { fetchMealDBRecipes } from '../api/mealdb'
import { fetchSpoonacularRecipes, normalizeSpoonacular } from '../api/spoonacular'

const RecipeContext = createContext(null)

// Returns true only if every ingredient the recipe needs is in the user's selection
// This is the core filter — recipes with any missing ingredient are excluded
function onlyUsesSelectedIngredients(recipe, selectedIngredients) {
  const selected = new Set(selectedIngredients.map((i) => i.toLowerCase().trim()))
  return recipe.ingredients.every((ing) => selected.has(ing.toLowerCase().trim()))
}

export function RecipeProvider({ children }) {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Calls both APIs concurrently, normalizes results to shared shape,
  // filters to only recipes the user can make with their selected ingredients,
  // then deduplicates by name before storing in context.
  async function fetchRecipes(selectedIngredients) {
    setLoading(true)
    setError(null)

    const [mealDBResult, spoonacularResult] = await Promise.allSettled([
      fetchMealDBRecipes(selectedIngredients),
      fetchSpoonacularRecipes(selectedIngredients),
    ])

    // Collect whichever APIs succeeded
    // fetchMealDBRecipes already returns normalized objects
    // fetchSpoonacularRecipes returns raw — normalize here
    const mealDBRecipes = mealDBResult.status === 'fulfilled' ? mealDBResult.value : []
    const spoonacularRecipes =
      spoonacularResult.status === 'fulfilled'
        ? spoonacularResult.value.map(normalizeSpoonacular)
        : []

    if (mealDBResult.status === 'rejected' || spoonacularResult.status === 'rejected') {
      setError('One or more recipe sources failed. Showing partial results.')
    }

    // Combine both API results — MealDB listed first so it wins on dedup
    const combined = [...mealDBRecipes, ...spoonacularRecipes]

    // Filter — only keep recipes where ALL ingredients are in the user's selection
    const filtered = combined.filter((recipe) =>
      onlyUsesSelectedIngredients(recipe, selectedIngredients)
    )

    // Deduplicate by name — first occurrence wins (MealDB preferred)
    const seen = new Set()
    const deduplicated = filtered.filter((recipe) => {
      const key = recipe.name.toLowerCase().trim()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    setRecipes(deduplicated)
    setLoading(false)
  }

  const value = {
    ingredients,
    setIngredients,
    recipes,
    setRecipes,
    loading,
    setLoading,
    error,
    setError,
    fetchRecipes,
  }

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipeContext() {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider')
  }
  return context
}
