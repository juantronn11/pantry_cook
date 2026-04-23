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
import { fetchSpoonacularRecipes } from '../api/spoonacular'
import { normalizeSpoonacularRecipe } from '../utils/normalizeRecipe'
import { parseIngredients } from '../utils/parseIngredients'
import { withTimeout } from '../utils/withTimeout'
import { stripHtml } from '../utils/stripHtml'
import { mergeIngredients } from '../utils/mergeIngredients'
import {useApi} from '../helperFunctions/helper'
import { useAuth0 } from "@auth0/auth0-react";
import { logError } from '../helperFunctions/logError'

const RecipeContext = createContext(null)

export function RecipeProvider({ children }) {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { getSavedRecipes, 
          updateRecipes, 
          deleteRecipe } = useApi();

  // SCRUM-106: Ingredients the user wants excluded from recipe results.
  // Each entry is a lowercase trimmed string (e.g. 'peanuts', 'shellfish').
  // addExclusion() prevents duplicates. removeExclusion() removes by value.
  // Passed to Spoonacular via &excludeIngredients in SCRUM-108.
  const [excludedIngredients, setExcludedIngredients] = useState([])

  // SCRUM-119: Track the last API fetch so we can skip re-fetching when
  // the user only adds exclusions without changing their ingredients.
  // allRecipes holds the full validated results from the last API call.
  // lastSearchedIngredients holds the ingredients used in that call.
  // lastFetchedExclusions holds the exclusions sent to the API in that call.
  const [allRecipes, setAllRecipes] = useState([])
  const [lastSearchedIngredients, setLastSearchedIngredients] = useState([])
  const [lastFetchedExclusions, setLastFetchedExclusions] = useState([])

  function addExclusion(ingredient) {
    const trimmed = ingredient.trim().toLowerCase()
    if (!trimmed) return
    setExcludedIngredients(prev =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    )
  }

  function removeExclusion(ingredient) {
    setExcludedIngredients(prev => prev.filter(i => i !== ingredient))
  }

  // SCRUM-45: Controls how the results list is sorted.
  // 'best-match'      — by matchScore descending (default, most ingredients matched first)
  // 'a-z'             — alphabetical by recipe name
  // 'fewest-missing'  — by missedIngredientCount ascending (fewest extra ingredients needed first)
  const [sortOrder, setSortOrder] = useState('best-match')

  // SCRUM-51: Saved recipes library — stores recipes the user explicitly saves.
  // Each entry is a normalized recipe object ({ id, name, source, raw }).
  // Persisted to localStorage so saves survive page refreshes.
  const [savedRecipes, setSavedRecipes] = useState([]);

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) return;
    getSavedRecipes()
      .then(recipes => setSavedRecipes(recipes))
      .catch(console.error);
  }, [isAuthenticated]);

  // SCRUM-107: Duplicate prevention — if the recipe is already in the
  // saved library (matched by ID), the array is returned unchanged so
  // no duplicate entry is created. The UI also indicates saved status
  // by toggling the button label to "Remove from Library" (see RecipeTile).

  async function saveRecipe(recipe) {
    if (savedRecipes.some(r => r.id === recipe.id)) return;

    setSavedRecipes(prev => [...prev, recipe]);

    try {
      await updateRecipes(recipe);
    } catch (e) {
      setSavedRecipes(savedRecipes); // rollback if API fails
      console.error('Failed to save recipe:', e);
      throw e;
    }
  }

  async function removeSavedRecipe(recipeId) {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));

    try {
      await deleteRecipe(recipeId);
    } catch (e) {
      setSavedRecipes(savedRecipes); // rollback if API fails
      console.error('Failed to remove recipe:', e);
      throw e;
    }
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
    try {
      const saved = localStorage.getItem('pantry-cook-history')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      logError(e.message, 'RecipeContext:localStorage:pantry-cook-history')
      return []
    }
  })

  // SCRUM-49: Sync history to localStorage whenever it changes.
  // useEffect watches the historyRecipes array via its dependency list.
  // Every time a new search is added (SCRUM-47), this effect fires and
  // writes the updated array to localStorage as a JSON string.
  useEffect(() => {
    localStorage.setItem('pantry-cook-history', JSON.stringify(historyRecipes))
  }, [historyRecipes])

  // SCRUM-131: Shopping list state — stores ingredients the user wants to buy.
  // Each entry has shape:
  //   { id: string, name: string, amount: number, unit: string, checked: boolean }
  // Persisted to localStorage so the list survives page refreshes.
  const [shoppingList, setShoppingList] = useState(() => {
    try {
      const saved = localStorage.getItem('pantry-cook-shopping-list')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      logError(e.message, 'RecipeContext:localStorage:pantry-cook-shopping-list')
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('pantry-cook-shopping-list', JSON.stringify(shoppingList))
  }, [shoppingList])

  // SCRUM-131: Add all ingredients from a recipe to the shopping list.
  // Merges duplicates: if an ingredient with the same name and unit already
  // exists, the amounts are combined. Otherwise a new entry is added.
  function addToShoppingList(recipe) {
    const newIngredients = recipe.raw?.extendedIngredients || []
    if (newIngredients.length === 0) return

    setShoppingList(prev => mergeIngredients(prev, newIngredients))
  }

  function removeFromShoppingList(itemId) {
    setShoppingList(prev => prev.filter(item => item.id !== itemId))
  }

  function toggleShoppingListItem(itemId) {
    setShoppingList(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    )
  }

  function addCustomItem(name) {
    const newItem = {
        id: Date.now(),
        name: name.trim(),
        amount: 0,
        unit: '',
        checked: false,
    }
    setShoppingList(prev => [...prev, newItem])
}

  function clearShoppingList() {
    setShoppingList([])
  }

  // SCRUM-45: Sorts a list of normalized recipe objects based on the active sortOrder.
  // Called both after a fresh fetch and whenever the user changes the sort dropdown.
  //   'best-match'     — highest matchScore first (most user ingredients used)
  //   'a-z'            — alphabetical by recipe name
  //   'fewest-missing' — fewest extra ingredients needed first (raw.missedIngredientCount)
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
  // SCRUM-119: If the user re-searches with the same ingredients and only added exclusions
  // (none removed), skip the API call and filter allRecipes client-side instead.
  async function fetchRecipes(rawIngredients) {
    setLoading(true)
    setError(null)

    // SCRUM-41: Parse and sanitize ingredients before sending to APIs.
    // Ensures both services receive trimmed, lowercased, deduplicated strings.
    const ingredients = parseIngredients(rawIngredients)

    // SCRUM-119: Check if we can skip the API call and filter client-side.
    // Same ingredients = no new fetch needed for the base results.
    // Exclusion removed = we need recipes back that the API already excluded, so re-fetch.
    const sameIngredients =
      ingredients.length === lastSearchedIngredients.length &&
      ingredients.every(i => lastSearchedIngredients.includes(i))

    const exclusionRemoved = lastFetchedExclusions.some(
      e => !excludedIngredients.includes(e)
    )
// User Story 24 | SCRUM-153: Change substring matching to exact matching in exclusion filter
// Current: `i.name.toLowerCase().includes(excl)` — "rice" matches "licorice"
// Fix: `i.name.toLowerCase() === excl` — "rice" only matches "rice"
// Check: (better fix?) ^ and exclude (' ' + excl) and (excl + ' ')
    if (sameIngredients && !exclusionRemoved && allRecipes.length > 0) {
      const filtered = allRecipes.filter(recipe =>
        !excludedIngredients.some(excl =>
          recipe.raw?.extendedIngredients?.some(i =>
            i.name.toLowerCase() === excl || i.name.toLowerCase().includes(' '+excl) || i.name.toLowerCase().includes(excl+' ')
          )
        )
      )
      setRecipes(sortRecipes(filtered, sortOrder))
      setLoading(false)
      return
    }

    // SCRUM-42: Wrap each API call with a 30-second timeout so the app
    // does not hang indefinitely if an external service stops responding.
    // If one API times out, Promise.allSettled marks it as rejected and
    // results from the other API still come through.
    const API_TIMEOUT = 30000
    const [spoonacularResult] = await Promise.allSettled([
      withTimeout(fetchSpoonacularRecipes(ingredients, excludedIngredients), API_TIMEOUT),
    ])

    if (spoonacularResult.status === 'rejected') {
      setError('Some results may be missing — one or more APIs failed.')
    }

    const spoonacularRecipes = spoonacularResult.status === 'fulfilled' ? spoonacularResult.value : []

    // SCRUM-19/46: normalize Spoonacular response to common shape
    const normalizedSpoonacular = spoonacularRecipes.map(normalizeSpoonacularRecipe)

    // Deduplicate by name
    const seen = new Set()
    const deduplicated = [...normalizedSpoonacular].filter(recipe => {
      if (seen.has(recipe.name)) return false
      seen.add(recipe.name)
      return true
    })

    // SCRUM-79/80/86: Filter out invalid recipes at the source so they never
    // reach the grid. Previously this validation ran during RecipeTile render
    // and called setRecipes(), causing an infinite re-render loop.
    const validated = deduplicated.filter(recipe => {
      try {
        const raw = recipe.raw
        if (!raw.strMeal && !raw.title) {
          throw new Error("Recipe name doesn't exist for " + (raw.title || raw.strMeal))
        }
        if (raw.strInstructions || raw.instructions) {
          const instructions = recipe.source === 'spoonacular' ? raw.instructions : raw.strInstructions
          const name = recipe.source === 'spoonacular' ? raw.title : raw.strMeal

          //Drop recipes with no instructions
          if (!instructions || instructions.trim() === '') {
            throw new Error("Recipe Instructions not found for " + name)
          }
          // SCRUM-115: Strip HTML tags from instructions and convert to
          // readable plain text instead of dropping the recipe entirely.
          if (instructions[0] === '<') {
            const stripped = stripHtml(instructions)
            if (recipe.source === 'spoonacular') {
              recipe.raw.instructions = stripped
            } else {
              recipe.raw.strInstructions = stripped
            }
          }
          // SCRUM-40: Check if the instructions are just a URL (not real instructions).
          // Allow recipes that mention URLs within real instruction text.
          // Always allow YouTube links.
          const urlPattern = /^https?:\/\/\S+$/;
          const youtubePattern = /https?:\/\/(www\\.)?(youtube\\.com|youtu\\.be)/i;

          if (urlPattern.test(instructions.trim())) {
            // The entire instruction is just a URL
            if (!youtubePattern.test(instructions.trim())) {
              // It's not Youtube - drop this recipe
              throw new Error("Recipe Intructions for " + name + " is a non-Youtube URL")
            }
          }
        }
        return true
      } catch (e) {
        console.error(e.message)
        return false
      }
    })

    // SCRUM-119: Store the full validated results and search params so future
    // re-searches with the same ingredients can filter client-side instead of re-fetching.
    setAllRecipes(validated)
    setLastSearchedIngredients(ingredients)
    setLastFetchedExclusions([...excludedIngredients])

    // SCRUM-43 + SCRUM-45: Sort the deduplicated list using the active sortOrder.
    // Default is 'best-match' (matchScore descending). User can change this via the
    // sort dropdown on ResultsPage without triggering a re-fetch.
    setRecipes(sortRecipes(validated, sortOrder))

    // SCRUM-47: Auto-add this search to history. Build a history entry from the
    // validated results, then prepend it so historyRecipes stays in reverse
    // chronological order. Cap at 50 entries to prevent unbounded localStorage
    // growth (SCRUM-49 will persist this).
    const historyEntry = {
      id: crypto.randomUUID(),
      ingredients: [...ingredients],
      timestamp: new Date().toISOString(),
      recipes: validated,
    }
    // SCRUM-114: Filter out history entries older than 30 days, then cap
    // at 100 entries. The time filter runs on each new search so stale
    // entries are cleaned up naturally as the user continues to use the app.
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    setHistoryRecipes(prev => {
      const fresh = prev.filter(entry => new Date(entry.timestamp).getTime() > thirtyDaysAgo)
      return [historyEntry, ...fresh].slice(0, 100)
    })

    setLoading(false)
  }

  // SCRUM-141: Resets all search-related state so the user gets a completely
  // clean search page. Called by the "New Search" button in Navbar.
  function resetSearch() {
    setIngredients([])
    setExcludedIngredients([])
    setRecipes([])
    setAllRecipes([])
    setLastSearchedIngredients([])
    setLastFetchedExclusions([])
    setError(null)
    setSortOrder('best-match')
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
    excludedIngredients,
    addExclusion,
    removeExclusion,
    resetSearch,
    shoppingList,
    addToShoppingList,
    removeFromShoppingList,
    toggleShoppingListItem,
    clearShoppingList,
    addCustomItem,
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
