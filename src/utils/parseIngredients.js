// SCRUM-41: Parse and sanitize raw ingredient input before API queries.
// Pure utility — no React or external dependencies.
//
// Ensures downstream consumers (API services, validation in SCRUM-40)
// receive a consistent, predictable array of ingredient strings:
//   - Trimmed of whitespace
//   - Lowercased for case-insensitive matching
//   - Empty strings removed
//   - Duplicates removed (preserves first occurrence)

export function parseIngredients(ingredients) {
  const seen = new Set()

  return ingredients
    .map(i => i.trim().toLowerCase())
    .filter(i => {
      if (i === '' || seen.has(i)) return false
      seen.add(i)
      return true
    })
}
