// normalizeRecipe.js — Consistent output shape for all recipe results
// SCRUM-46: Single source of truth for the normalized recipe shape used
// throughout the app. All recipes pass through this helper before being
// stored in context or displayed in the UI.

/**
 * Normalizes a Spoonacular recipe to the app's standard shape.
 * matchScore comes from usedIngredientCount attached by fetchSpoonacularRecipes (SCRUM-43).
 *
 * @param {object} recipe - Spoonacular recipe with matchScore already attached
 * @returns {{ id: string, name: string, source: 'spoonacular', matchScore: number, raw: object }}
 */
export function normalizeSpoonacularRecipe(recipe) {
  return {
    id: `spoonacular-${recipe.id}`,
    name: recipe.title.toLowerCase().trim(),
    source: 'spoonacular',
    matchScore: recipe.matchScore ?? 0,
    raw: recipe,
  }
}
