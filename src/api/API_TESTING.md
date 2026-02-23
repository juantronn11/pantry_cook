# API Testing Guide — SCRUM-16, SCRUM-17, SCRUM-18 & SCRUM-19

---

## SCRUM-16, SCRUM-17 & SCRUM-18 — What Was Verified

### SCRUM-16 — One call per ingredient
- `fetchMealDBRecipes(['chicken'])` → one request to `filter.php?i=chicken` ✅
- `fetchSpoonacularRecipes(['chicken'])` → one request to `findByIngredients?ingredients=chicken` ✅

### SCRUM-17 — Concurrent calls
- Both ingredients fire at the same timestamp — confirmed via DevTools → Network → Fetch/XHR ✅
- `Promise.allSettled()` inside each service — one failed ingredient doesn't stop others ✅

### SCRUM-18 — Graceful failure
- If one API fails entirely, `error` is set in context and the other API's results still return ✅
- Both APIs failing simultaneously won't set `error` (both return `[]` internally — dev-only edge case)
- Common errors: MealDB 429 (rate limit), Spoonacular 402 (daily quota), Spoonacular 401 (missing `.env`)

---

# SCRUM-19 — Testing Deduplication + Unified Response

Verifies: both API results are normalized to a common shape and deduplicated by name before being set in context.

## How to Run

```bash
npm run dev
```

Go to `http://localhost:5173` — results display directly on the page.

---

## What to Look For

### Both APIs succeed
```
fetchRecipes() returned 38 deduplicated recipes — SCRUM-19 working
Sources: mealdb, spoonacular
First result: chicken tikka masala (from mealdb)
```
- Count is lower than a raw combined total — deduplication removed overlapping names ✅
- Both sources listed — both APIs contributed ✅
- `name` is lowercase/trimmed, `source` identifies the API ✅

### One API fails — graceful failure still works
```
Error: Some results may be missing — one or more APIs failed.
fetchRecipes() returned 19 deduplicated recipes — SCRUM-19 working
Sources: mealdb
```
- Error shown ✅, results from working API still returned ✅

### Both APIs fail
```
Error: Some results may be missing — one or more APIs failed.
No recipes returned.
```

---

## Normalized Recipe Shape

Each item in `recipes` context array:
```js
{
  id: "mealdb-52772",           // prefixed — no ID collisions between APIs
  name: "chicken tikka masala", // lowercase + trimmed — used for dedup key
  source: "mealdb",             // or "spoonacular"
  raw: { /* original API response object */ }
}
```
Check this in DevTools → Console: `window.__recipes = recipes` or log it in SearchPage.

---

## Cleanup

Remove the temp test code from `SearchPage.jsx` before the final PR merge.
