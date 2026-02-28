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

## What the Test Code Does

`SearchPage.jsx` has temp test code that runs `fetchRecipes(['chicken', 'garlic'])` automatically on page load and displays the results directly on screen. It includes a `useRef` guard so the fetch only fires once even though React StrictMode triggers `useEffect` twice in dev — without it every page load would burn double the Spoonacular quota.

**What it shows on screen:**
- `loading` state while both APIs are in flight
- `error` message in red if one API failed
- Total deduplicated recipe count, which sources contributed, and the first result's name

## How to Run

```bash
npm run dev
```

Go to `http://localhost:5173` — results display directly on the page.

---

# SCRUM-18 — Testing Graceful Failure Handling

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

## Testing by Commit — How to Step Through

The branch has two cleanup commits after the main test commit. Use the commit title to find the right one with `git log --oneline`, then checkout just `SearchPage.jsx` at that point.

```bash
git log --oneline
```

### Stage 1 — "SCRUM-19 - Add temp test code to SearchPage and update API_TESTING.md"
Full on-screen output — most visible, easiest to verify quickly:
```bash
git checkout <hash> -- src/pages/SearchPage.jsx
npm run dev
```
Go to `http://localhost:5173` — results show directly on the page:
- Recipe count, which sources contributed, first result name
- Red error message if an API failed
- Good for: quickly seeing whether both APIs responded and dedup is working

### Stage 2 — "SCRUM-19 - Cleanup 1: remove on-screen test output from SearchPage"
No on-screen output — API still fires, results visible in DevTools only:
```bash
git checkout <hash> -- src/pages/SearchPage.jsx
npm run dev
```
Open DevTools:
- **Network → Fetch/XHR** — confirm MealDB and Spoonacular calls fired at the same time
- **Console** — recipes array logged with full normalized shape `{ id, name, source, raw }`
- Good for: inspecting the raw recipe objects and verifying the normalized shape

### Stage 3 — "SCRUM-19 - Cleanup 2: remove useRef guard and useEffect from SearchPage"
Clean final state — no test code at all, this is what merges to `dev`:
```bash
git checkout <hash> -- src/pages/SearchPage.jsx
```
All SCRUM-19 logic lives in `src/context/RecipeContext.jsx`. SearchPage is a plain placeholder.

---

## Cleanup Complete

Test code has been removed. The final `SearchPage.jsx` on this branch is a clean placeholder.
All SCRUM-19 logic is in `src/context/RecipeContext.jsx` — `fetchRecipes()` normalizes and deduplicates both API results before setting `recipes` in context.
