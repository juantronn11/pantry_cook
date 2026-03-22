// normalizeRecipe.js — Consistent output shape for all recipe results
// SCRUM-46: Single source of truth for the normalized recipe shape used
// throughout the app. All recipes from any API pass through these helpers
// before being stored in context or displayed in the UI.

export function normalizeMealDBRecipe(meal) {
  return {
    id: `mealdb-${meal.idMeal}`,
    name: meal.strMeal.toLowerCase().trim(),
    source: 'mealdb',
    matchScore: 0,
    raw: meal,
  }
}

export function normalizeSpoonacularRecipe(recipe) {
  return {
    id: `spoonacular-${recipe.id}`,
    name: recipe.title.toLowerCase().trim(),
    source: 'spoonacular',
    matchScore: recipe.matchScore ?? 0,
    raw: recipe,
  }
}
