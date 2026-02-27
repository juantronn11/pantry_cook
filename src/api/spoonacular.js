// Spoonacular API service — testing-integration update
// Switched from per-ingredient concurrent calls to single multi-ingredient call.
// findByIngredients returns usedIngredients + missedIngredients per recipe
// so no separate detail lookup is needed for the ingredient filter step.
//
// API key stored in .env as VITE_SPOONACULAR_API_KEY (never commit)
//
// Endpoints used:
//   GET /recipes/findByIngredients — returns recipes matching all ingredients

const BASE_URL = 'https://api.spoonacular.com'
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY

// Searches for recipes using all selected ingredients in one call
// ranking=2 minimizes missing ingredients (best for pantry-based search)
// ignorePantry=false ensures all ingredients are counted (not just non-pantry)
export async function fetchSpoonacularRecipes(ingredients) {
  const query = ingredients.map(encodeURIComponent).join(',')
  const res = await fetch(
    `${BASE_URL}/recipes/findByIngredients?ingredients=${query}&number=20&ranking=2&ignorePantry=false&apiKey=${API_KEY}`
  )
  if (!res.ok) throw new Error(`Spoonacular search failed: ${res.status}`)
  return res.json()
}

// Normalizes a Spoonacular recipe to the shared recipe shape
// { id, name, source, ingredients[], raw }
// ingredients[] is built from usedIngredients + missedIngredients on the response
export function normalizeSpoonacular(recipe) {
  const ingredients = [
    ...recipe.usedIngredients.map((i) => i.name),
    ...recipe.missedIngredients.map((i) => i.name),
  ]
  return {
    id: `spoonacular-${recipe.id}`,
    name: recipe.title,
    source: 'spoonacular',
    ingredients,
    raw: recipe,
  }
}
