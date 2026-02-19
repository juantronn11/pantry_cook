// RecipeContext — Shared state provider for the Recipe App
//
// This file creates a React Context that holds the app's shared state
// so that multiple components can access the same data without
// passing props through every level of the component tree.
//
// Shared state:
//   - ingredients (array)  — selected ingredients from SearchForm
//   - recipes (array)      — recipe results from the Spoonacular API
//   - loading (boolean)    — true while an API call is in progress
//   - error (string|null)  — error message if an API call fails
//
// Usage in any component:
//   import { useRecipeContext } from '../context/RecipeContext'
//   const { recipes, loading } = useRecipeContext()

import { createContext, useContext, useState } from 'react'

const RecipeContext = createContext(null)

export function RecipeProvider({ children }) {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const value = {
    ingredients,
    setIngredients,
    recipes,
    setRecipes,
    loading,
    setLoading,
    error,
    setError,
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
