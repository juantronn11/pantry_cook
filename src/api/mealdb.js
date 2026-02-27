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

// Fires all ingredient searches concurrently and returns deduplicated results (SCRUM-17)
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

  // Deduplicate by meal ID and return
  const seen = new Set()
  return allMeals.filter((meal) => {
    if (seen.has(meal.idMeal)) return false
    seen.add(meal.idMeal)
    return true
  })
}
