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

const BASE_URL = 'https://api.spoonacular.com'
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY

// Makes one API call for a single ingredient
async function searchByIngredient(ingredient) {
  const res = await fetch(
    `${BASE_URL}/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredient)}&number=10&ranking=1&ignorePantry=true&apiKey=${API_KEY}`
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
export async function fetchSpoonacularRecipes(ingredients) {
  // All ingredient searches fire at the same time
  const searchResults = await Promise.allSettled(
    ingredients.map((ingredient) => searchByIngredient(ingredient))
  )

  // Keep only successful searches
  const allRecipes = []
  for (const result of searchResults) {
    if (result.status === 'fulfilled') allRecipes.push(...result.value)
  }

  // Deduplicate by recipe ID
  const seen = new Set()
  const uniqueRecipes = allRecipes.filter((recipe) => {
    if (seen.has(recipe.id)) return false
    seen.add(recipe.id)
    return true
  })

  // SCRUM-71: Fetch details in batches of 3 with 500ms delay to avoid 429 rate limits
  const detailResults = await batchGetDetails(uniqueRecipes)

  return detailResults
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value)
}
