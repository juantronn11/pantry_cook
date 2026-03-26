# SCRUM-106 Testing Guide
**Branch:** `SCRUM-106-implement-add-remove-logic-for`
**Owner:** Juan Estrada
**User Story:** As a user, I want to add and remove excluded ingredients so I can control what recipes are shown to me.

---

## What This Branch Does

Wires the `ExcludeIngredients` component to `RecipeContext`. The exclusion list is now shared state — any component in the app can read `excludedIngredients` or call `addExclusion()` / `removeExclusion()`.

**Exclusions still do not filter search results yet** — that's SCRUM-108. This SCRUM connects the UI to context so the data is in the right place for filtering.

---

## Branch History / Dependencies

This branch is stacked on top of `SCRUM-104-design-the-exclude-ingredient-`. The ExcludeIngredients component and its styles were built in SCRUM-104. This branch adds context wiring only — no new UI.

---

## Files Changed

| File | What Changed |
|---|---|
| `src/context/RecipeContext.jsx` | Added `excludedIngredients` state, `addExclusion()`, `removeExclusion()` — all exposed in context value |
| `src/components/ExcludeIngredients/ExcludeIngredients.jsx` | Replaced local `useState` with `excludedIngredients`, `addExclusion`, `removeExclusion` from context |

---

## How to Test

### Setup
```bash
git checkout SCRUM-106-implement-add-remove-logic-for
npm install
npm run dev
```

### Test Steps

1. Open `http://localhost:5173`
2. **Add an exclusion** — type "peanuts" in the exclude input and click **+ Add**. Chip appears.
3. **Verify context state** — open React DevTools → find `RecipeProvider` in the component tree → confirm `excludedIngredients` array contains `"peanuts"`.
4. **Add more** — add "shellfish" and "dairy". Confirm all three appear in `excludedIngredients` in DevTools.
5. **Remove one** — click **✕** on "shellfish". Confirm it's removed from both the UI and the DevTools state.
6. **Duplicate prevention** — type "peanuts" again and click **+ Add**. The chip count should not increase — duplicate is silently ignored.
7. **Search still works** — add exclusions, then search for recipes. Results load as normal (exclusions don't filter yet — that's SCRUM-108).

### What changed vs SCRUM-104
- In SCRUM-104, the exclusion chips were stored in local component state — refreshing the component would reset them and no other component could see them.
- In SCRUM-106, the list lives in RecipeContext — it persists across re-renders and is accessible app-wide, ready for SCRUM-108 to pass to the API.

---

## Known Limitations
- Excluded ingredients are **not yet passed to the search pipeline** — filtering comes in SCRUM-108.
- Exclusion list resets on page refresh — persistence is not in scope.
