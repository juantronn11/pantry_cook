# SCRUM-44 — Branch Testing Guide

**Branch:** `SCRUM-44-duplicate-recipes-returned-acro`
**Owner:** Juan Estrada
**User Story 8:** Duplicate recipes returned across different API calls are merged into a single entry

---

## What This Branch Does

When a user selects multiple ingredients (e.g. `chicken` + `garlic`), the app fires a separate Spoonacular search per ingredient. The same recipe can appear in multiple search results. Previously, duplicates were removed using first-seen logic — whichever result came back first was kept, even if a later result had a higher ingredient match count.

This branch fixes that: when the same recipe appears more than once across searches, we now keep the entry with the **highest `usedIngredientCount`** so the match score used for ranking is as accurate as possible.

---

## Branch History — What's Included Here

This branch was **rebased on top of SCRUM-43** before any SCRUM-44 work was written. SCRUM-43 has not yet merged into `dev2`, so to avoid building on stale code, SCRUM-44 was stacked directly on top of SCRUM-43's branch:

```
dev2 (base)
  └── SCRUM-43 commits (ranking by matchScore)
        └── SCRUM-44 commits (dedup improvement)  ← you are here
```

This means **all of SCRUM-43 is present on this branch** — ranking by matchScore, the matchScoreById map, and the sort in RecipeContext. Once SCRUM-43 merges into `dev2`, this branch will be rebased onto `dev2` and git will drop the duplicate SCRUM-43 commits automatically.

See [SCRUM-43-testing.md](SCRUM-43-testing.md) for full details on the ranking behaviour.

---

## How to Test Locally

### Setup
```bash
git checkout SCRUM-44-duplicate-recipes-returned-acro
npm install
npm run dev
```
Make sure `.env` has your Spoonacular API key:
```
VITE_SPOONACULAR_API_KEY=your_key_here
```

### Test Steps

1. Open the app and open **DevTools → Console** (F12)
2. Select **3+ ingredients** that are likely to share recipes — e.g. `chicken`, `garlic`, `onion`
3. Click **Search**
4. Check:
   - No recipe appears more than once in the results grid
   - Results are still ordered best-match first (SCRUM-43 behaviour)

---

## Running the Existing Tests

```bash
./node_modules/.bin/vitest run
```

Expected: **38 tests passing, 0 failing**

The existing dedup test (`deduplicates recipes that appear in multiple ingredient searches`) covers this behaviour directly and passes with the new Map-based logic.

> Use `./node_modules/.bin/vitest run` — NOT `npx vitest`

---

## Files Changed (SCRUM-44 only)

| File | What changed |
|------|-------------|
| `src/api/spoonacular.js` | Replaced Set-based dedup (first-seen wins) with a Map that keeps the entry with the highest `usedIngredientCount` when the same recipe ID appears from multiple searches. |

---

## Known Limitations

- **MealDB results always get `matchScore: 0`** — MealDB doesn't return ingredient match counts.
- **Strict mode (exact ingredient matches only) coming in SCRUM-45.**
