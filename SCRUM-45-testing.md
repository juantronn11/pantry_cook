# SCRUM-45 Testing Guide
**Branch:** `SCRUM-45-the-final-filtered-list-is-sort`
**Owner:** Juan Estrada
**User Story:** As a user, I want the final filtered list to be sorted so I can find the most relevant recipes faster.

---

## What This Branch Does

Adds a **sort dropdown** above the recipe results grid that lets the user reorder results without performing a new search.

Three sort modes:
| Option | Behavior |
|---|---|
| **Best Match** (default) | Recipes using the most of your ingredients appear first (`matchScore` descending) |
| **A – Z** | Alphabetical by recipe name |
| **Fewest Missing Ingredients** | Recipes that need the fewest extra ingredients you don't have appear first |

Sort state lives in `RecipeContext` (`sortOrder`) so it's shared across the app. Changing the dropdown re-sorts the existing results instantly — no new API call is made.

---

## Branch History / Dependencies

This branch was rebased on top of `dev2` after the following branches merged:
- **SCRUM-43** — adds `matchScore` to each recipe (required for Best Match sort)
- **SCRUM-44** — deduplication keeps the highest-match version of duplicate recipes
- **SCRUM-47/48/49** — search history (teammate work)
- **SCRUM-51** — save to library (teammate work)
- **SCRUM-102** — history page (teammate work)

All of the above are already in `dev2`. This branch builds cleanly on top of them.

---

## Files Changed

| File | What Changed |
|---|---|
| `src/context/RecipeContext.jsx` | Added `sortOrder` state, `sortRecipes()` helper, `useEffect` to re-sort on sort change, applied sort in `fetchRecipes` |
| `src/pages/ResultsPage.jsx` | Added sort bar with dropdown wired to context |
| `src/pages/ResultsPage.module.css` | New file — styles for the sort bar |

---

## How to Test

### Setup
```bash
git checkout SCRUM-45-the-final-filtered-list-is-sort
npm install
npm run dev
```
Make sure your `.env` has a valid Spoonacular API key (`VITE_SPOONACULAR_API_KEY`).

### Test Steps

1. **Search for recipes** — enter 2-3 ingredients (e.g. chicken, garlic, lemon) and submit.
2. **Verify default sort** — results should appear with highest ingredient matches at the top. Check the sort dropdown reads "Best Match".
3. **Switch to A – Z** — dropdown → "A – Z". Recipe grid should reorder alphabetically immediately (no loading spinner, no new API call).
4. **Switch to Fewest Missing Ingredients** — dropdown → "Fewest Missing Ingredients". Recipes needing the least extra ingredients should rise to the top. MealDB recipes (which don't have this data) should fall toward the bottom.
5. **Switch back to Best Match** — grid reorders back to the original ranking.
6. **Sort bar visibility** — sort bar should be hidden before any search, hidden while loading, and only visible once results are displayed.
7. **New search resets correctly** — do a second search. The sort dropdown should apply the currently selected mode to the new results automatically.

### DevTools Check (Optional)
Open React DevTools → find `RecipeProvider` in the component tree → confirm `sortOrder` state updates when you change the dropdown.

---

## Known Limitations

- MealDB recipes always have `matchScore: 0` and no `missedIngredientCount` — they will appear at the bottom in both Best Match and Fewest Missing sorts.
- Sort preference is not persisted to localStorage — refreshing the page resets to "Best Match".
