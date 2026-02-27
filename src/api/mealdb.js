// MealDB API service — testing-integration update
// Adds getMealDetails() and normalizeMealDB() for the ingredient filter step.
//
// Endpoints used:
//   GET /filter.php?i={ingredient} — returns meals containing that ingredient
//   GET /lookup.php?i={idMeal}    — returns full meal details with ingredient list
//
// Note: lookup.php is CORS blocked on the free tier — getMealDetails returns null
// and those meals are excluded from results. Full filtering requires premium tier.
// filter.php works on both free and premium.

const BASE_URL = import.meta.env.VITE_MEALDB_BASE_URL

// Makes one API call for a single ingredient
async function searchByIngredient(ingredient) {
  const res = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`)
  if (!res.ok) throw new Error(`MealDB search failed for "${ingredient}": ${res.status}`)
  const data = await res.json()
  return data.meals || []
}

// Fetches full meal details via lookup.php
// Returns null if CORS blocked (free tier) or request fails
// Full details include strIngredient1-20 needed for ingredient filtering
async function getMealDetails(idMeal) {
  try {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${idMeal}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.meals ? data.meals[0] : null
  } catch {
    // CORS blocked on free tier — null signals caller to skip this meal
    return null
  }
}

// Normalizes a full MealDB meal (from lookup.php) to the shared recipe shape
// { id, name, source, ingredients[], raw }
// ingredients[] is built from strIngredient1 through strIngredient20
export function normalizeMealDB(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]
    if (ing && ing.trim()) ingredients.push(ing.trim())
  }
  return {
    id: `mealdb-${meal.idMeal}`,
    name: meal.strMeal,
    source: 'mealdb',
    ingredients,
    raw: meal,
  }
}

// Fires all ingredient searches concurrently, finds intersection of results,
// then fetches full details for each matched meal to get the ingredient list.
// Returns normalized meal objects ready for the ingredient filter step.
// On free tier lookup.php is CORS blocked — returns [] in that case.
export async function fetchMealDBRecipes(ingredients) {
  // All ingredient searches fire at the same time
  const searchResults = await Promise.allSettled(
    ingredients.map((ingredient) => searchByIngredient(ingredient))
  )

  // Keep only successful result sets
  const resultSets = searchResults
    .filter((result) => result.status === 'fulfilled' && result.value.length > 0)
    .map((result) => result.value)

  if (resultSets.length === 0) return []

  // Find meal IDs that appear in ALL ingredient result sets (intersection)
  const firstIdSet = new Set(resultSets[0].map((meal) => meal.idMeal))
  const intersectingIds = resultSets.slice(1).reduce((ids, meals) => {
    const currentIds = new Set(meals.map((meal) => meal.idMeal))
    return new Set([...ids].filter((id) => currentIds.has(id)))
  }, firstIdSet)

  const intersectingMeals = resultSets[0].filter((meal) => intersectingIds.has(meal.idMeal))

  // Fetch full details for each intersecting meal (needed for ingredient list)
  const detailResults = await Promise.allSettled(
    intersectingMeals.map((meal) => getMealDetails(meal.idMeal))
  )

  // Return normalized meals — skip any where detail fetch failed or returned null
  return detailResults
    .filter((r) => r.status === 'fulfilled' && r.value !== null)
    .map((r) => normalizeMealDB(r.value))
}
