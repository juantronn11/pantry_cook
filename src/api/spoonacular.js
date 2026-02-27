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

// Fires all ingredient searches concurrently then fetches all details concurrently (SCRUM-17)
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

  // All detail lookups fire at the same time
  const detailResults = await Promise.allSettled(
    uniqueRecipes.map((recipe) => getRecipeDetails(recipe.id))
  )

  return detailResults
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value)
}
