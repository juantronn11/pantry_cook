// MealDB API service — SCRUM-17
// Upgraded from SCRUM-16: API calls now fire concurrently using
// Promise.allSettled() so multiple ingredient searches run at the
// same time instead of waiting for each one to finish sequentially.
//
// Endpoint used:
//   GET /filter.php?i={ingredient} — returns meals that use that ingredient
//   Returns: idMeal, strMeal, strMealThumb — sufficient for RecipeTile display
//
// Note: lookup.php (full detail fetch) removed — CORS blocked on free tier
// and fires too many concurrent requests. filter.php data is sufficient.
// Full recipe link: https://www.themealdb.com/meal/{idMeal}

const BASE_URL = import.meta.env.VITE_MEALDB_BASE_URL

// Makes one API call for a single ingredient
async function searchByIngredient(ingredient) {
  const res = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`)
  if (!res.ok) throw new Error(`MealDB search failed for "${ingredient}": ${res.status}`)
  const data = await res.json()
  return data.meals || []
}

// Fires all ingredient searches concurrently and returns only meals that contain
// ALL selected ingredients (intersection, not union) (SCRUM-17)
export async function fetchMealDBRecipes(ingredients) {
  // All ingredient searches fire at the same time
  const searchResults = await Promise.allSettled(
    ingredients.map((ingredient) => searchByIngredient(ingredient))
  )

  // Keep only successful result sets
  const resultSets = searchResults
    .filter(result => result.status === 'fulfilled' && result.value.length > 0)
    .map(result => result.value)

  if (resultSets.length === 0) return []

  // Find meal IDs that appear in ALL ingredient result sets (intersection)
  const firstIdSet = new Set(resultSets[0].map(meal => meal.idMeal))
  const intersectingIds = resultSets.slice(1).reduce((ids, meals) => {
    const currentIds = new Set(meals.map(meal => meal.idMeal))
    return new Set([...ids].filter(id => currentIds.has(id)))
  }, firstIdSet)

  // Return full meal objects for intersecting IDs
  return resultSets[0].filter(meal => intersectingIds.has(meal.idMeal))
}
