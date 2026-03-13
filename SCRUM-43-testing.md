# SCRUM-43 — Branch Testing Guide

**Branch:** `SCRUM-43-recipes-that-match-more-of-my-e`
**Owner:** Juan Estrada
**User Story 8:** Filter recipes for multiple ingredients from multiple API calls

---

## What This Branch Does

Recipes that match **more** of your selected ingredients now appear **first** in the results.

Before this change, results came back in whatever order the API returned them. Now:
- Each recipe gets a `matchScore` equal to how many of your selected ingredients it uses
- The final list is sorted by `matchScore` descending — best matches at the top
- MealDB results get `matchScore: 0` since that API doesn't return match counts

This is the foundation for the full strict mode feature coming in SCRUM-44/45.

---

## How to Test Locally

### Setup
```bash
git checkout SCRUM-43-recipes-that-match-more-of-my-e
npm install
npm run dev
```
Make sure you have a `.env` file with your Spoonacular API key:
```
VITE_SPOONACULAR_API_KEY=your_key_here
```

### Test Steps

1. Open the app in your browser
2. Open **browser DevTools → Console tab** (F12)
3. Select **2 or more ingredients** — pick ingredients likely to appear in different recipes (e.g. `chicken` + `garlic` + `onion`)
4. Click **Search**
5. Watch the console and the results grid

### What to Look For

**In the results grid:**
- Recipes that use more of your selected ingredients should appear at the top
- Recipes requiring many extra ingredients should appear lower down

**In the DevTools console** (if the proof log commit is checked out):
```
[SCRUM-43] Sorted results by matchScore: [
  { name: "garlic chicken", matchScore: 3, source: "spoonacular" },
  { name: "chicken soup",   matchScore: 2, source: "spoonacular" },
  { name: "pasta",          matchScore: 1, source: "spoonacular" },
  { name: "beef stew",      matchScore: 0, source: "mealdb" },
  ...
]
```
The `matchScore` should decrease (or stay the same) as you scroll down the list.

---

## Running the Existing Tests

```bash
./node_modules/.bin/vitest run
```

Expected: **38 tests passing, 0 failing**

> Use `./node_modules/.bin/vitest run` — NOT `npx vitest` (npx pulls a mismatched version missing jsdom)

---

## Files Changed in This Branch

| File | What changed |
|------|-------------|
| `src/api/spoonacular.js` | Saves `usedIngredientCount` from `findByIngredients` into a map before the detail fetch loses it. Attaches it as `matchScore` on each returned result. |
| `src/context/RecipeContext.jsx` | Adds `matchScore` to normalized MealDB (0) and Spoonacular shapes. Sorts the final deduplicated list by `matchScore` descending before setting state. |

---

## Known Limitations

- **MealDB results always get `matchScore: 0`** — MealDB's API doesn't return how many ingredients matched. MealDB results will appear below Spoonacular results after sorting.
- **matchScore accuracy improves in SCRUM-44** — right now if the same recipe appears from two different ingredient searches, we keep the first-seen version which may have a lower score. SCRUM-44 fixes this.
- This branch does **not** include strict mode (exact matches only) — that's coming in SCRUM-45.

---

