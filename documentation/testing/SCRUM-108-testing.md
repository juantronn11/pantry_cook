# SCRUM-108 Testing Guide
**Branch:** `SCRUM-108-backend-filtering-for-excluded`
**Owner:** Juan Estrada
**User Story:** As a user, I want recipes containing ingredients I've excluded to never appear in my results.

---

## What This Branch Does

Connects the `excludedIngredients` list (built in SCRUM-106) to both APIs:

- **Spoonacular** — exclusions are passed server-side via `&excludeIngredients=x,y`. Spoonacular filters before returning results.
- **MealDB** — exclusions are applied client-side in `RecipeContext` after results return. Because MealDB's free-tier endpoint (`filter.php`) only returns recipe ID, name, and thumbnail (no ingredient list), filtering checks whether the recipe **name** contains an excluded term. This is best-effort — if the excluded ingredient doesn't appear in the recipe name, MealDB cannot detect it.

---

## Branch History / Dependencies

Stacked on `SCRUM-106-implement-add-remove-logic-for`. The ExcludeIngredients UI and context state were built in SCRUM-104/106. This branch wires that state into the actual search pipeline.

---

## Files Changed

| File | What Changed |
|---|---|
| `src/api/spoonacular.js` | `searchByIngredient` now accepts `excludedIngredients` and appends `&excludeIngredients=x,y` to the Spoonacular query |
| `src/context/RecipeContext.jsx` | Passes `excludedIngredients` to `fetchSpoonacularRecipes`; filters `normalizedMealDB` client-side by recipe name before deduplication |

---

## How to Test

### Setup
```bash
git checkout SCRUM-108-backend-filtering-for-excluded
npm install
npm run dev
```

### Test 1 — Spoonacular exclusion (server-side)

1. Open `http://localhost:5173`
2. Add ingredients to search (e.g. "chicken, garlic")
3. In the **Exclude Ingredients** section, add "pasta"
4. Click **Search**
5. Confirm no Spoonacular results contain pasta in the title or ingredients
6. Open the Network tab in DevTools → find the Spoonacular request → confirm the URL includes `excludeIngredients=pasta`

### Test 2 — MealDB exclusion (client-side, name-based)

1. Add ingredients to search (e.g. "chicken")
2. Add an exclusion that appears in a MealDB recipe name — e.g. "curry"
3. Click **Search**
4. Confirm no MealDB results with "curry" in the name appear in the grid

### Test 3 — Multiple exclusions

1. Add 2–3 exclusions (e.g. "pasta", "cream", "beef")
2. Search for a broad ingredient like "chicken"
3. Confirm none of the returned recipes include those terms (Spoonacular server-side, MealDB name-based)

### Test 4 — No exclusions (baseline)

1. Leave the exclusions list empty
2. Search normally
3. Confirm results are unchanged from pre-SCRUM-108 behavior — the exclusion filter short-circuits when the list is empty

### Test 5 — All results excluded

1. Add an exclusion that would match almost every recipe for your ingredient (e.g. search "chicken", exclude "chicken")
2. Confirm the app does not crash or show a blank white screen
3. Results may be empty or sparse — full empty-state handling comes in SCRUM-110

---

## Known Limitations

- **MealDB filtering is name-based only.** MealDB's `filter.php` endpoint does not return an ingredient list, and the detail endpoint (`lookup.php`) is CORS-blocked on the free tier. If an excluded ingredient is used in a recipe but not mentioned in the recipe name, that recipe will still appear in MealDB results.
- **Empty results are not yet handled gracefully** — if all recipes are filtered out, no message is shown. That's SCRUM-110.
- Exclusion list resets on page refresh — persistence is not in scope.
