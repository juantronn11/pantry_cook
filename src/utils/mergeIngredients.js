// mergeIngredients — pure utility for combining ingredient lists
//
// Takes an existing shopping list and an array of new ingredients,
// returns a new list with duplicates merged by name + unit.
// Same name + same unit = amounts combined.
// Same name + different unit = listed separately.

export function mergeIngredients(existingList, newIngredients) {
  const updated = existingList.map(item => ({ ...item }))

  for (const ing of newIngredients) {
    const name = ing.name?.toLowerCase().trim()
    if (!name) continue

    const unit = ing.unit || ''
    const amount = ing.amount || 0

    const existing = updated.find(
      item => item.name === name && item.unit === unit
    )

    if (existing) {
      existing.amount += amount
    } else {
      updated.push({
        id: crypto.randomUUID(),
        name,
        amount,
        unit,
        checked: false,
      })
    }
  }

  return updated
}
