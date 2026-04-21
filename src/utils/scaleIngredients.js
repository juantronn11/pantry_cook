// scaleIngredients — pure utility for scaling recipe ingredient amounts
//
// Takes an array of Spoonacular-shape ingredients and a scale ratio,
// returns a new array with each ingredient's amount multiplied by the ratio.
// Does not mutate the input array or its objects.

export function scaleIngredients(ingredients, ratio) {
  if (!ingredients || ingredients.length === 0) return []
  if (!Number.isFinite(ratio) || ratio <= 0) return ingredients.map(ing => ({ ...ing }))

  return ingredients.map(ing => ({
    ...ing,
    amount: (ing.amount || 0) * ratio,
  }))
}
