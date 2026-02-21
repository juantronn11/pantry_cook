// MealDB API service — SCRUM-17
// Upgraded from SCRUM-16: API calls now fire concurrently using
// Promise.allSettled() so multiple ingredient searches run at the
// same time instead of waiting for each one to finish sequentially.
//
// Endpoints used:
//   GET /filter.php?i={ingredient} — returns meals that use that ingredient
//   GET /lookup.php?i={id}         — returns full details for one meal

const BASE_URL = import.meta.env.VITE_MEALDB_BASE_URL

// Makes one API call for a single ingredient
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

// Fires all ingredient searches concurrently then fetches all details concurrently (SCRUM-17)
export async function fetchMealDBRecipes(ingredients) {
  // All ingredient searches fire at the same time
  const searchResults = await Promise.allSettled(
    ingredients.map((ingredient) => searchByIngredient(ingredient))
  )

  // Keep only successful searches
  const allMeals = []
  for (const result of searchResults) {
    if (result.status === 'fulfilled') allMeals.push(...result.value)
  }

  // Deduplicate by meal ID
  const seen = new Set()
  const uniqueMeals = allMeals.filter((meal) => {
    if (seen.has(meal.idMeal)) return false
    seen.add(meal.idMeal)
    return true
  })

  // All detail lookups fire at the same time
  const detailResults = await Promise.allSettled(
    uniqueMeals.map((meal) => getMealDetails(meal.idMeal))
  )

  return detailResults
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value)
}
