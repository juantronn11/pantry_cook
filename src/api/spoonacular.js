// Spoonacular API service — SCRUM-16
// Makes one API call per submitted ingredient to the Spoonacular external API.
//
// API key stored in .env as VITE_SPOONACULAR_API_KEY (never commit)
//
// Endpoints used:
//   GET /recipes/findByIngredients — returns recipes matching an ingredient
//   GET /recipes/{id}/information  — returns full details for one recipe

const BASE_URL = 'https://api.spoonacular.com'
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY

// Makes one API call for a single ingredient (SCRUM-16)
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

// Makes one call per ingredient sequentially, then fetches details for each result.
export async function fetchSpoonacularRecipes(ingredients) {
  const allRecipes = []

  for (const ingredient of ingredients) {
    const recipes = await searchByIngredient(ingredient)
    allRecipes.push(...recipes)
  }

  // Deduplicate by recipe ID
  const seen = new Set()
  const uniqueRecipes = allRecipes.filter((recipe) => {
    if (seen.has(recipe.id)) return false
    seen.add(recipe.id)
    return true
  })

  // Fetch full details for each unique recipe
  const detailed = []
  for (const recipe of uniqueRecipes) {
    const details = await getRecipeDetails(recipe.id)
    if (details) detailed.push(details)
  }

  return detailed
}
