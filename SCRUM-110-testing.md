# SCRUM-110 Testing Guide
**Branch:** `SCRUM-110-handle-empty-results`
**Owner:** Juan Estrada
**User Story:** As a user, I want to see a clear explanation when my exclusions filter out all results, not a blank or confusing screen.

---

## What This Branch Does

When a search returns zero results because excluded ingredients filtered everything out, the app now shows a targeted message explaining why — instead of the generic "no recipes found" message or a blank screen.

---

## Branch History / Dependencies

Stacked on `SCRUM-108-backend-filtering-for-excluded`. Exclusion filtering (Spoonacular server-side + MealDB client-side) was built in SCRUM-108. This branch handles the UX when that filtering leaves nothing to show.

---

## Files Changed

| File | What Changed |
|---|---|
| `src/components/RecipeGrid/RecipeGrid.jsx` | Pulls `excludedIngredients` from context; branches the empty state message based on whether exclusions are active |

---

## How to Test

### Setup
```bash
git checkout SCRUM-110-handle-empty-results
npm install
npm run dev
```

### Test 1 — Exclusion-specific empty state

1. Open `http://localhost:5173`
2. Add an ingredient to search (e.g. "chicken")
3. In **Exclude Ingredients**, add an exclusion that will catch most results (e.g. "chicken")
4. Click **Search**
5. Confirm the message reads: **"No recipes found — try removing some excluded ingredients."**

### Test 2 — Generic empty state still works

1. Clear all exclusions
2. Search for an ingredient combination unlikely to return results (e.g. "dragonfruit, anchovies, miso")
3. Click **Search**
4. Confirm the original message appears: **"No recipes found. Try adding some ingredients to search!"**

### Test 3 — Normal results unaffected

1. Add a realistic ingredient (e.g. "chicken, garlic")
2. Add no exclusions, or add an exclusion that doesn't match anything
3. Click **Search**
4. Confirm results load normally — no empty state message shown

---

## Known Limitations

- MealDB filtering is name-based only (see SCRUM-108 notes) — the exclusion message may appear even if MealDB had results that couldn't be detected.
- Exclusion list resets on page refresh — persistence is not in scope.
