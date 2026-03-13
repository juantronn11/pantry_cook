// RecipeContext — Shared state provider for the Recipe App
//
// This file creates a React Context that holds the app's shared state
// so that multiple components can access the same data without
// passing props through every level of the component tree.
//
// Shared state:
//   - ingredients (array)  — selected ingredients from SearchForm
//   - recipes (array)      — recipe results from both APIs, merged
//   - loading (boolean)    — true while API calls are in progress
//   - error (string|null)  — set if one or more API calls fail
//
// Usage in any component:
//   import { useRecipeContext } from '../context/RecipeContext'
//   const { recipes, loading, fetchRecipes } = useRecipeContext()

import { createContext, useContext, useState } from 'react'
import { fetchMealDBRecipes } from '../api/mealdb'
import { fetchSpoonacularRecipes } from '../api/spoonacular'

const RecipeContext = createContext(null)

export function RecipeProvider({ children }) {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // SCRUM-18: fetchRecipes fires both API calls concurrently via Promise.allSettled().
  // If one API fails, the error flag is set but results from the other still come through.
  // SCRUM-19: results from both APIs are normalized to a common shape and deduplicated by name.
  async function fetchRecipes(ingredients) {
    setLoading(true)
    setError(null)

    const [mealDBResult, spoonacularResult] = await Promise.allSettled([
      fetchMealDBRecipes(ingredients),
      fetchSpoonacularRecipes(ingredients),
    ])

    if (mealDBResult.status === 'rejected' || spoonacularResult.status === 'rejected') {
      setError('Some results may be missing — one or more APIs failed.')
    }

    const mealDBRecipes = mealDBResult.status === 'fulfilled' ? mealDBResult.value : []
    const spoonacularRecipes = spoonacularResult.status === 'fulfilled' ? spoonacularResult.value : []

    // SCRUM-19: normalize both API response shapes to a common format
    // SCRUM-43: matchScore added to both shapes — MealDB gets 0 since that API
    // does not return ingredient match counts
    const normalizedMealDB = mealDBRecipes.map(meal => ({
      id: `mealdb-${meal.idMeal}`,
      name: meal.strMeal.toLowerCase().trim(),
      source: 'mealdb',
      matchScore: 0,
      raw: meal,
    }))

    const normalizedSpoonacular = spoonacularRecipes.map(recipe => ({
      id: `spoonacular-${recipe.id}`,
      name: recipe.title.toLowerCase().trim(),
      source: 'spoonacular',
      matchScore: recipe.matchScore ?? 0,
      raw: recipe,
    }))

    // Deduplicate by name — MealDB entries are listed first so they take priority
    const seen = new Set()
    const deduplicated = [...normalizedMealDB, ...normalizedSpoonacular].filter(recipe => {
      if (seen.has(recipe.name)) return false
      seen.add(recipe.name)
      return true
    })

    // SCRUM-43: Sort by matchScore descending so recipes matching more of the
    // user's ingredients appear first. MealDB results have matchScore 0 since
    // the MealDB API does not return ingredient match counts.
    deduplicated.sort((a, b) => b.matchScore - a.matchScore)

    // SCRUM-43 TEST — open browser devtools console to verify ranking order.
    // Remove this log before final merge into dev2.
    console.log(
      '[SCRUM-43] Sorted results by matchScore:',
      deduplicated.map(r => ({ name: r.name, matchScore: r.matchScore, source: r.source }))
    )

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
