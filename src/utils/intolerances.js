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

// Spoonacular's /information endpoint returns boolean flags for some intolerances.
// For others we fall back to ingredient-keyword matching.
export const INTOLERANCE_RECIPE_FIELD = {
  'dairy':  'dairyFree',
  'gluten': 'glutenFree',
  'wheat':  'glutenFree',
}

export const INTOLERANCE_KEYWORDS = {
  'egg':      ['egg', 'eggs', 'mayonnaise', 'mayo'],
  'peanut':   ['peanut', 'peanuts', 'peanut butter'],
  'seafood':  ['fish', 'tuna', 'salmon', 'cod', 'tilapia', 'anchovy', 'anchovy', 'halibut', 'bass'],
  'sesame':   ['sesame', 'tahini'],
  'shellfish':['shrimp', 'crab', 'lobster', 'clam', 'oyster', 'mussel', 'scallop', 'prawn'],
  'soy':      ['soy', 'tofu', 'edamame', 'miso', 'tempeh', 'soya'],
  'sulfite':  ['wine', 'vinegar', 'dried fruit', 'dried apricot'],
  'tree nut': ['almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'macadamia', 'brazil nut'],
}
