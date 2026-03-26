# SCRUM-104 Testing Guide
**Branch:** `SCRUM-104-design-the-exclude-ingredient-`
**Owner:** Juan Estrada
**User Story:** As a user, I want to be able to exclude specific ingredients from my recipe results.

---

## What This Branch Does

Adds the **ExcludeIngredients** UI component to the search page. The user can type an ingredient they want to avoid, hit **+ Add** or press **Enter**, and it appears as a removable chip below the input. Clicking **✕** on a chip removes it.

**This SCRUM is visual only** — the exclusions do not affect search results yet. Wiring to the search pipeline happens in SCRUM-106 and SCRUM-108.

---

## Files Changed

| File | What Changed |
|---|---|
| `src/components/ExcludeIngredients/ExcludeIngredients.jsx` | New component — input, add button, chip list with remove buttons |
| `src/components/ExcludeIngredients/ExcludeIngredients.module.css` | New file — styles for container, input row, add button, chips |
| `src/pages/SearchPage.jsx` | Imported and rendered `<ExcludeIngredients />` below `<SearchForm />` |

---

## How to Test

### Setup
```bash
git checkout SCRUM-104-design-the-exclude-ingredient-
npm install
npm run dev
```

### Test Steps

1. Open `http://localhost:5173`
2. **Find the exclude section** — below the ingredient search input, you should see an "Exclude ingredients:" label with a text input and a **+ Add** button.
3. **Add an ingredient** — type "peanuts" and click **+ Add**. A chip labelled "peanuts" should appear below the input. The input should clear.
4. **Add via Enter key** — type "shellfish" and press **Enter**. Chip appears, input clears.
5. **Add multiple chips** — add "dairy", "gluten". All chips display in a row.
6. **No duplicates** — try adding "peanuts" again. Nothing should happen (duplicate prevention).
7. **Remove a chip** — click **✕** on "peanuts". It disappears.
8. **Empty input** — click **+ Add** with nothing typed. Nothing should happen.
9. **Search still works** — add some excluded ingredients, then do a normal search. Results should load as normal (exclusions don't filter yet — that's SCRUM-106/108).

---

## Known Limitations
- Excluded ingredients are **not yet passed to the search pipeline** — they are stored in local component state only. Actual filtering comes in SCRUM-106 (context wiring) and SCRUM-108 (backend filtering).
- Excluded list resets if the page is refreshed — persistence is not in scope for this SCRUM.
