# SCRUM-46 — Testing Guide

**Branch:** `SCRUM-46-the-filtered-results-are-return`
**What this branch does:** Extracts the recipe normalization logic into a shared utility file so all recipes across both APIs always return a consistent structured format.

---

## What Changed

No visible behavior changes — this is a code quality improvement.

| File | Change |
|------|--------|
| `src/utils/normalizeRecipe.js` | **New file** — exports `normalizeMealDBRecipe()` and `normalizeSpoonacularRecipe()` with JSDoc documenting the exact output shape |
| `src/context/RecipeContext.jsx` | Imports the two helpers and replaces the inline `.map()` normalization blocks with `.map(normalizeMealDBRecipe)` and `.map(normalizeSpoonacularRecipe)` |

---

## Normalized Recipe Shape

Every recipe in the app now conforms to this shape, defined in `src/utils/normalizeRecipe.js`:

```js
{
  id:         string  // 'spoonacular-123' or 'mealdb-456'
  name:       string  // lowercase trimmed title
  source:     string  // 'spoonacular' | 'mealdb'
  matchScore: number  // ingredient match count (always 0 for MealDB)
  raw:        object  // original API response, untouched
}
```

---

## How to Test

### Setup
```bash
npm run dev
```

### Steps
1. Open the app at `http://localhost:5173`
2. Select 2–3 ingredients (e.g. Chicken, Garlic, Lemon)
3. Hit **Search**
4. Open DevTools → Console

### What to verify in DevTools
The app behavior should be **identical** to before this branch. Specifically:
- Results load and display correctly
- `[spoonacular]` and `[mealdb]` source tags appear on recipe tiles
- Sort dropdown works (Best Match / A–Z / Fewest Missing Ingredients)
- No console errors related to normalization or missing fields

### What this branch does NOT change
- No new UI elements
- No changes to sort, dedup, or ranking logic
- No changes to history, saved recipes, or any other feature

---

## Files Changed
- `src/utils/normalizeRecipe.js` *(new)*
- `src/context/RecipeContext.jsx` *(import + replace inline maps)*
