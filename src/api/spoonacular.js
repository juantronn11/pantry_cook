// Spoonacular API service — SCRUM-17
// Upgraded from SCRUM-16: API calls now fire concurrently using
// Promise.allSettled() so multiple ingredient searches run at the
// same time instead of waiting for each one to finish sequentially.
//
// API key stored in .env as VITE_SPOONACULAR_API_KEY (never commit)
//
// Endpoints used:
//   GET /recipes/findByIngredients — returns recipes matching an ingredient
//   GET /recipes/{id}/information  — returns full details for one recipe
// User text book autocomplete — SCRUM-27
// Endpoints used:
//   GET /food/ingredients/autocomplete — returns a list of ingredients given a string query

import { INTOLERANCE_RECIPE_FIELD, INTOLERANCE_KEYWORDS } from '../utils/intolerances'

const BASE_URL = 'https://api.spoonacular.com'
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
const CACHE_TTL_MS = 30 * 60 * 1000

const recipeCache = new Map();

function getCacheKey(ingredients, intolerances = []){
  const ingKey = [...ingredients].map((i) => i.trim().toLowerCase()).sort().join(',')
  const intKey = [...intolerances].sort().join(',')
  return intKey ? `${ingKey}|${intKey}` : ingKey
}

function getCachedResults(ingredients, intolerances = []){
  const key = getCacheKey(ingredients, intolerances);
  const entry = recipeCache.get(key);
  if(!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    recipeCache.delete(key)
    return null
  }

  return entry.results;

}

function setCachedResults(ingredients, results, intolerances = []){
  recipeCache.set(getCacheKey(ingredients, intolerances),{results, timestamp: Date.now()})
}

// SCRUM-116: Counter tracks how many autocomplete API calls are made.
// Check the browser console to see the count logged on each call.
let autocompleteCallCount = 0
export function getAutocompleteCallCount() { return autocompleteCallCount }
export function resetAutocompleteCallCount() { autocompleteCallCount = 0 }

// SCRUM-39: expose an endpoint for ingredient autocompletion with user input
export async function ingredientAutocomplete(query) {
  autocompleteCallCount++
  const res = await fetch (
    `${BASE_URL}/food/ingredients/autocomplete?query=${encodeURIComponent(query)}&number=10&meta_information=false&intolerances=&language=en&apiKey=${API_KEY}`
  )
  if (!res.ok) throw new Error(`Spoonacular autocomplete failed for "${query}"`)
    return res.json();
}

// Makes one API call for a single ingredient
// SCRUM-108: excludedIngredients passed as &excludeIngredients so Spoonacular
// filters server-side — excluded recipes never come back in the response.
async function searchByIngredient(ingredient, excludedIngredients = []) {
  const excludeParam = excludedIngredients.length > 0
    ? `&excludeIngredients=${encodeURIComponent(excludedIngredients.join(','))}`
    : ''
  const res = await fetch(
    `${BASE_URL}/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredient)}&number=10&ranking=1&ignorePantry=true${excludeParam}&apiKey=${API_KEY}`
  )
  if (!res.ok) throw new Error(`Spoonacular search failed for "${ingredient}": ${res.status}`)
  return res.json()
}

// Fetches full details for a single recipe by ID
async function getRecipeDetails(id) {
  const res = await fetch(`${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`)
  if (!res.ok) throw new Error(`Spoonacular detail fetch failed for id ${id}: ${res.status}`)
  return res.json()
}

// SCRUM-71: Fetches recipe details in small batches with a delay between each batch
// to avoid triggering Spoonacular's per-second rate limit (HTTP 429).
// batchSize = how many calls fire at once, delayMs = pause between batches.
async function batchGetDetails(recipes, batchSize = 3, delayMs = 500) {
  const results = []

  for (let i = 0; i < recipes.length; i += batchSize) {
    const batch = recipes.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(
      batch.map((recipe) => getRecipeDetails(recipe.id))
    )
    results.push(...batchResults)

    // Pause before the next batch (skip delay after the last batch)
    if (i + batchSize < recipes.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return results
}

// Fires all ingredient searches concurrently then fetches details in throttled
// batches to stay within Spoonacular's rate limits (SCRUM-17, SCRUM-71)
// SCRUM-43: usedIngredientCount is saved before the detail fetch because the
// /information endpoint does not return match counts. matchScore is attached
// to each result so RecipeContext can sort by relevance.
// SCRUM-108: Accept excludedIngredients and append to each search call so
// Spoonacular filters server-side before returning any results.
export async function fetchSpoonacularRecipes(ingredients, excludedIngredients = [], intolerances = []) {
  // All ingredient searches fire at the same time

  let unfilteredResults = getCachedResults(ingredients, intolerances);
  if(!unfilteredResults){
    const searchResults = await Promise.allSettled(
      ingredients.map((ingredient) => searchByIngredient(ingredient, []))
    )
    // Keep only successful searches1
    const allRecipes = []
    for (const result of searchResults) {
      if (result.status === 'fulfilled') allRecipes.push(...result.value)
    }
    // SCRUM-44: Deduplicate by ID — when the same recipe appears across multiple
    // ingredient searches, keep the entry with the highest usedIngredientCount
    // so matchScore (used by SCRUM-43's sort) reflects the best match found.
    const recipeMap = new Map()
    for (const recipe of allRecipes) {
      const existing = recipeMap.get(recipe.id)
      if (!existing || (recipe.usedIngredientCount ?? 0) > (existing.usedIngredientCount ?? 0)) {
        recipeMap.set(recipe.id, recipe)
      }
    }
    const uniqueRecipes = Array.from(recipeMap.values())

    // SCRUM-43: Preserve match counts before detail fetch loses them
    const matchScoreById = new Map(
      uniqueRecipes.map((r) => [r.id, r.usedIngredientCount ?? 0])
    )

    // SCRUM-71: Fetch details in batches of 3 with 500ms delay to avoid 429 rate limits
    const detailResults = await batchGetDetails(uniqueRecipes)

    // SCRUM-43: Attach matchScore to each result so RecipeContext can rank by relevance
    unfilteredResults = detailResults
      .filter((r) => r.status === 'fulfilled' && r.value)
      .map((r) => ({
        ...r.value,
        matchScore: matchScoreById.get(r.value.id) ?? 0,
      }))
      
      setCachedResults(ingredients, unfilteredResults, intolerances);

  }

  // Apply intolerance filtering using recipe boolean flags and ingredient keywords
  let filtered = unfilteredResults
  if (intolerances.length > 0) {
    filtered = filtered.filter(recipe => {
      return intolerances.every(intol => {
        const field = INTOLERANCE_RECIPE_FIELD[intol]
        if (field) return recipe[field] === true

        const keywords = INTOLERANCE_KEYWORDS[intol] || []
        return !recipe.extendedIngredients?.some(ing =>
          keywords.some(kw => ing.name?.toLowerCase().includes(kw))
        )
      })
    })
  }

  // Apply specific ingredient exclusions
  if (excludedIngredients.length === 0) return filtered
  const excluded = excludedIngredients.map((e) => e.trim().toLowerCase())
  return filtered.filter((recipe) =>
    !recipe.extendedIngredients?.some((ing) =>
      excluded.some((ex) => ing.name?.toLowerCase().includes(ex))
    )
  )
}

