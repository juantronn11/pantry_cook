// MealDB API service — SCRUM-16
// Makes one API call per submitted ingredient to TheMealDB external API.
//
// Free tier base URL uses test key "1" — no sign-up required for development.
//
// Endpoints used:
//   GET /filter.php?i={ingredient} — returns meals that use that ingredient
//   GET /lookup.php?i={id}         — returns full details for one meal

const BASE_URL = import.meta.env.VITE_MEALDB_BASE_URL

// Makes one API call for a single ingredient (SCRUM-16)
async function searchByIngredient(ingredient) {
  const res = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`)
  if (!res.ok) throw new Error(`MealDB search failed for "${ingredient}": ${res.status}`)
  const data = await res.json()
  return data.meals || []
}

// Fetches full details for a single meal by ID
async function getMealDetails(id) {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
  if (!res.ok) throw new Error(`MealDB detail fetch failed for id ${id}: ${res.status}`)
  const data = await res.json()
  return data.meals?.[0] || null
}

// Makes one call per ingredient sequentially, then fetches details for each result.
export async function fetchMealDBRecipes(ingredients) {
  const allMeals = []

  for (const ingredient of ingredients) {
    const meals = await searchByIngredient(ingredient)
    allMeals.push(...meals)
  }

  // Deduplicate by meal ID
  const seen = new Set()
  const uniqueMeals = allMeals.filter((meal) => {
    if (seen.has(meal.idMeal)) return false
    seen.add(meal.idMeal)
    return true
  })

  // Fetch full details for each unique meal
  const detailed = []
  for (const meal of uniqueMeals) {
    const details = await getMealDetails(meal.idMeal)
    if (details) detailed.push(details)
  }

  return detailed
}
