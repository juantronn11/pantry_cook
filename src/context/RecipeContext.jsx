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

import { createContext, useContext, useState, useEffect } from 'react'
import { fetchMealDBRecipes } from '../api/mealdb'
import { fetchSpoonacularRecipes } from '../api/spoonacular'

const RecipeContext = createContext(null)

export function RecipeProvider({ children }) {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // SCRUM-45: Controls how the results list is sorted.
  // 'best-match'      — by matchScore descending (default, most ingredients matched first)
  // 'a-z'             — alphabetical by recipe name
  // 'fewest-missing'  — by missedIngredientCount ascending (fewest extra ingredients needed first)
  const [sortOrder, setSortOrder] = useState('best-match')

  // SCRUM-51: Saved recipes library — stores recipes the user explicitly saves.
  // Each entry is a normalized recipe object ({ id, name, source, raw }).
  // Persisted to localStorage so saves survive page refreshes.
  const [savedRecipes, setSavedRecipes] = useState(() => {
    const saved = localStorage.getItem('pantry-cook-saved')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('pantry-cook-saved', JSON.stringify(savedRecipes))
  }, [savedRecipes])

  function saveRecipe(recipe) {
    setSavedRecipes(prev => {
      if (prev.some(r => r.id === recipe.id)) return prev
      return [...prev, recipe]
    })
  }

  function removeSavedRecipe(recipeId) {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId))
  }

  function isRecipeSaved(recipeId) {
    return savedRecipes.some(r => r.id === recipeId)
  }

  // SCRUM-48: Search history state — stores past search sessions.
  // Each entry is an object with shape:
  //   {
  //     id: string (crypto.randomUUID()),
  //     ingredients: string[] (what was searched),
  //     timestamp: string (ISO date of when the search happened),
  //     recipes: array of normalized recipe objects ({ id, name, source, raw })
  //   }
  // Entries are stored newest-first (prepended) so the array is already
  // in reverse chronological order for display on the History page.
  //
  // SCRUM-49: Lazy initializer — reads saved history from localStorage on
  // first render so data survives page refreshes and browser restarts.
  // The function form of useState() runs only once (on mount), not on
  // every re-render, so the JSON.parse cost is paid just once.
  const [historyRecipes, setHistoryRecipes] = useState(() => {
    const saved = localStorage.getItem('pantry-cook-history')
    return saved ? JSON.parse(saved) : []
  })

  // SCRUM-49: Sync history to localStorage whenever it changes.
  // useEffect watches the historyRecipes array via its dependency list.
  // Every time a new search is added (SCRUM-47), this effect fires and
  // writes the updated array to localStorage as a JSON string.
  useEffect(() => {
    localStorage.setItem('pantry-cook-history', JSON.stringify(historyRecipes))
  }, [historyRecipes])

  // SCRUM-45: Sorts a list of normalized recipe objects based on the active sortOrder.
  // Called both after a fresh fetch and whenever the user changes the sort dropdown.
  //   'best-match'     — highest matchScore first (most user ingredients used)
  //   'a-z'            — alphabetical by recipe name
  //   'fewest-missing' — fewest extra ingredients needed first (raw.missedIngredientCount)
  //                      MealDB recipes don't have this field so they fall to the bottom.
  function sortRecipes(list, order) {
    const sorted = [...list]
    if (order === 'a-z') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (order === 'fewest-missing') {
      sorted.sort((a, b) => {
        const aMissed = a.raw?.missedIngredientCount ?? Infinity
        const bMissed = b.raw?.missedIngredientCount ?? Infinity
        return aMissed - bMissed
      })
    } else {
      // default: 'best-match'
      sorted.sort((a, b) => b.matchScore - a.matchScore)
    }
    return sorted
  }

  // SCRUM-45: Re-sort the existing results whenever the user changes sortOrder.
  // This avoids a full re-fetch — the data is already there, we just reorder it.
  useEffect(() => {
    if (recipes.length === 0) return
    setRecipes(prev => sortRecipes(prev, sortOrder))
  }, [sortOrder])

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

    // SCRUM-43 + SCRUM-45: Sort the deduplicated list using the active sortOrder.
    // Default is 'best-match' (matchScore descending). User can change this via the
    // sort dropdown on ResultsPage without triggering a re-fetch.
    setRecipes(sortRecipes(deduplicated, sortOrder))

    // SCRUM-47: Auto-add this search to history. Build a history entry from the
    // ingredients that were searched and the deduplicated results, then prepend it
    // so historyRecipes stays in reverse chronological order. Cap at 50 entries
    // to prevent unbounded localStorage growth (SCRUM-49 will persist this).
    const historyEntry = {
      id: crypto.randomUUID(),
      ingredients: [...ingredients],
      timestamp: new Date().toISOString(),
      recipes: deduplicated,
    }
    setHistoryRecipes(prev => [historyEntry, ...prev].slice(0, 50))

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
    historyRecipes,
    setHistoryRecipes,
    savedRecipes,
    saveRecipe,
    removeSavedRecipe,
    isRecipeSaved,
    sortOrder,
    setSortOrder,
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
