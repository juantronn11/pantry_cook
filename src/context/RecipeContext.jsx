// RecipeContext — Shared state provider for the Recipe App
//
// This file creates a React Context that holds the app's shared state
// so that multiple components can access the same data without
// passing props through every level of the component tree.
//
// Shared state:
//   - ingredients (array)  — selected ingredients from SearchForm
//   - recipes (array)      — recipe results from MealDB API
//   - loading (boolean)    — true while API call is in progress
//   - error (string|null)  — set if the API call fails
//
// Usage in any component:
//   import { useRecipeContext } from '../context/RecipeContext'
//   const { recipes, loading, fetchRecipes } = useRecipeContext()

import { createContext, useContext, useState } from 'react'
import { fetchMealDBRecipes } from '../api/mealdb'

const RecipeContext = createContext(null)

export function RecipeProvider({ children }) {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Calls MealDB for all selected ingredients and stores results in context.
  // Sets loading while the call is in progress and error if it fails.
  async function fetchRecipes(ingredients) {
    setLoading(true)
    setError(null)

    try {
      const results = await fetchMealDBRecipes(ingredients)
      setRecipes(results)
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.')
      setRecipes([])
    }

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
