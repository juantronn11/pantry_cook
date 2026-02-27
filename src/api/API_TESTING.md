# API Testing Guide — testing-integration branch

Last updated: 2026-02-27

---

## What This Branch Does

When a user selects ingredients and clicks Search:

1. **Both APIs fire concurrently** — MealDB and Spoonacular run at the same time via `Promise.allSettled()`
2. **Results are normalized** — both APIs return the same shape `{ id, name, source, ingredients[], raw }`
3. **Filter runs** — only recipes where **every ingredient** is in the user's selection are kept
4. **Deduplicate** — if both APIs return the same recipe name, MealDB version is kept

---

## How to Test

```bash
npm run dev
```

Go to `http://localhost:5173/search`, select ingredients, click Search.

---

## What to Look For

### Recipes returned — filter is working
Select **chicken** only → results should only be recipes that need nothing but chicken.

Select **chicken + garlic** → results should only be recipes that need only chicken and garlic — no recipes that also require onions, tomatoes, or anything else you didn't select.

If a recipe appears that needs an ingredient you didn't select → filter bug.

### No recipes returned — may be expected
Selecting very specific or uncommon combinations may legitimately return 0 results — there may be no recipes in either database that only use those exact ingredients. This is correct behavior, not a bug.

### Partial results with error banner
If one API fails (rate limit, network issue), you'll see an error message and results from the other API only. App should not crash.

### No results + no error
Both APIs failed silently (rate limited). See rate limit section below.

---

## Checking the Network Tab

Open DevTools → Network → Fetch/XHR while clicking Search.

**Spoonacular** — one request:
```
findByIngredients?ingredients=chicken%2Cgarlic&number=20&ranking=2&ignorePantry=false&apiKey=...
```
Single call with all ingredients comma-separated. If you see multiple Spoonacular calls something is wrong.

**MealDB** — one request per ingredient:
```
filter.php?i=chicken
filter.php?i=garlic
```
All fire at the same time (same timestamp). Then `lookup.php?i={idMeal}` calls fire for each matched meal.

> **Free tier note:** `lookup.php` is CORS blocked on MealDB free tier. You will see CORS errors in the console for those calls — this is expected. MealDB returns no results on free tier. Spoonacular handles the filter on free tier. Both APIs contribute results on premium.

---

## Recipe Object Shape

Each item in `recipes` context now looks like:

```js
{
  id: "spoonacular-715538",       // "mealdb-{id}" or "spoonacular-{id}"
  name: "Garlic Chicken",         // recipe name
  source: "spoonacular",          // which API it came from
  ingredients: ["chicken", "garlic"],  // full ingredient list used for filter
  raw: { ...originalAPIResponse } // full original API object
}
```

**For RecipeTile (Miguel):**
- MealDB: `recipe.raw.strMeal`, `recipe.raw.strMealThumb`, `recipe.raw.idMeal`
- Spoonacular: `recipe.raw.title`, `recipe.raw.image`, `recipe.raw.id`

---

## Rate Limit Errors

| Error | Cause | Fix |
|-------|-------|-----|
| MealDB CORS error in console | `lookup.php` blocked on free tier — expected | Upgrade to premium |
| Spoonacular 402 | Daily quota hit (150 req/day) | Key resets overnight |
| Spoonacular 401 | `.env` missing or Vite not restarted | Add key, restart `npm run dev` |
| MealDB 429 | Rate limited — CORS error is a side effect | Wait and retry |

> React StrictMode double-invokes effects in dev — burns through Spoonacular quota twice as fast. Normal behavior, not a bug.

---

## Free Tier vs Premium

| | Free tier | Premium |
|--|-----------|---------|
| Spoonacular filter | ✅ works | ✅ works |
| MealDB filter | ❌ CORS on lookup.php → no MealDB results | ✅ works |
| Results shown | Spoonacular only | Both APIs |
