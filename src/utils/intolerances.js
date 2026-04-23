export const INTOLERANCE_TERMS = [
  'dairy',
  'egg',
  'gluten',
  'peanut',
  'seafood',
  'sesame',
  'shellfish',
  'soy',
  'sulfite',
  'tree nut',
  'wheat',
]

export function isIntolerance(term) {
  return INTOLERANCE_TERMS.includes(term.trim().toLowerCase())
}
