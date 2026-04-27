# Assignment 14 — Unit Test Plan (Christian)

**Author:** Christian Johnson
**Sprint:** Spring 2026, Assignment 14
**Branch:** `SCRUM-173-unit-test-planning-documentati` (planning), `SCRUM-174-unit-test-creation---christian` (implementation)

### Framework
- **Vitest 4** — already in `package.json`
- **@testing-library/react** — for the `.jsx` context test
- Reporter: Vitest HTML reporter for committed results

---

### How to run (localized to this folder)
From the project root:
```bash
# Watch mode for Christian's tests only
npx vitest --config documentation/tests/christian_tests_and_results/vitest.config.js

# One-shot run + regenerate HTML report
npx vitest --config documentation/tests/christian_tests_and_results/vitest.config.js --run
```

Or from within the `christian_tests_and_results/` folder:
```bash
npx vitest --config ./vitest.config.js
npx vitest --config ./vitest.config.js --run
```

### How to view the HTML report
The Vitest HTML report fetches its data at runtime, so opening `index.html` directly in a browser (via `file://`) renders a blank page. Serve it over HTTP instead:

```bash
npx vite preview --outDir documentation/tests/christian_tests_and_results/results
```

Then open the printed `http://localhost:4173/` URL in a browser — the report loads automatically (no extra path needed). Alternatively, right-click `index.html` in VS Code and choose **Open with Live Server** (requires the Live Server extension).

### Repo layout (this folder)
```
documentation/tests/christian_tests_and_results/
  Christian_Assignment-14-test-plan.md  ← this file
  setup.js                            ← Vitest setup (jsdom + cleanup hooks)
  SearchForm.test.jsx
  parseIngredients.test.js
  ingredientTrie.test.js
  results/
    index.html                        ← generated HTML report (served via vite preview)
```

### Quick links
- **Results:** [results/index.html](results/index.html)
- **Test files:**
  - [SearchForm.test.jsx](SearchForm.test.jsx)
  - [parseIngredients.test.js](parseIngredients.test.js)
  - [ingredientTrie.test.js](ingredientTrie.test.js)
- **Setup:** [setup.js](setup.js)

---

## My 3 Tests

### 1. Search form with ingredients — `SearchForm.jsx`

- **Test file:** [SearchForm.test.jsx](SearchForm.test.jsx)
- **Feature:** Multi-ingredient selection with autocomplete suggestions, keyboard navigation, and form validation (SCRUM-14, SCRUM-27, SCRUM-39).
- **Code under test:** `SearchForm` component — state management (`query`, `suggestions`, `selectedIngredients`, `activeIndex`), handlers (`handleInput`, `handleSelect`, `handleRemove`, `handleKeySelection`), and `RecipeContext` integration in [src/components/SearchForm/SearchForm.jsx](../../../src/components/SearchForm/SearchForm.jsx).
- **Why test it:** Multi-feature React component with local state, event handlers, keyboard navigation, autocomplete integration, and context-driven side effects (SCRUM-141: ingredient sync).
- **Fields / return objects asserted:**
  - `handleInput` updates `query` state and populates `suggestions` via `ingredientAutocomplete(query)`.
  - `handleSelect` adds ingredient to `selectedIngredients` array (max 5 items enforced, duplicates rejected).
  - `handleRemove` removes ingredient from `selectedIngredients`.
  - Arrow Up/Down keys navigate `activeIndex` through suggestions with wrapping (0 ↔ length-1).
  - Enter key selects the highlighted suggestion and clears input/suggestions.
  - When `context.ingredients` array clears (from "New Search"), local form state (`selectedIngredients`, `query`, `suggestions`) resets via `useEffect`.
  - Suggestions list displays correctly with `aria-activedescendant` for accessibility.

### 2. Ingredient parser — `parseIngredients.js`

- **Test file:** [parseIngredients.test.js](parseIngredients.test.js)
- **Feature:** Parse and sanitize raw ingredient input before API queries and validation (SCRUM-41).
- **Code under test:** `parseIngredients(ingredients)` pure utility function in [src/utils/parseIngredients.js](../../../src/utils/parseIngredients.js).
- **Why test it:** Pure function with deterministic string transformations — trims, lowercases, deduplicates, and filters empty strings; downstream consumers (API, validation) depend on consistent output.
- **Fields / return objects asserted:**
  - Input array with mixed whitespace and casing returns trimmed, lowercased strings.
  - Empty strings (`""`, `"   "`) are filtered out.
  - Duplicate entries removed, keeping **first occurrence** only.
  - Returns a **new array** (original unmodified).
  - Edge cases: empty input `[]`, single element, all duplicates, mixed empty/whitespace entries all handled correctly.
  - Output is suitable for case-insensitive matching in API queries.

### 3. Ingredient autocomplete Trie — `ingredientTrie.js`

- **Test file:** [ingredientTrie.test.js](ingredientTrie.test.js)
- **Feature:** Fast prefix-based ingredient autocomplete from 3400+ pre-loaded ingredients (SCRUM-118, SCRUM-27).
- **Code under test:** `TrieNode` class, `Trie` class (`insert()` and `search()` methods), and `ingredientAutocomplete(query)` export in [src/utils/ingredientTrie.js](../../../src/utils/ingredientTrie.js).
- **Why test it:** Core autocomplete performance engine — Trie construction, efficient prefix matching, result limiting, and query normalization are critical for search UX.
- **Fields / return objects asserted:**
  - `Trie.insert(name)` adds ingredient to trie structure with lowercase normalization.
  - `Trie.search(query)` returns matching ingredients for the query prefix (**case-insensitive**).
  - `search()` returns up to 10 results by default (matches top-10 pre-cached at each node).
  - `search(query, limit)` respects custom limit parameter (e.g., `search("a", 5)` returns ≤5 items).
  - `ingredientAutocomplete(query)` returns array of strings from `trie.search()`.
  - Empty or whitespace-only queries return `[]`.
  - Results match only **prefix** (e.g., "all" returns "almond", "all bran", but not "ball").
  - All returned results are valid ingredients from the pre-loaded `INGREDIENTS` array.
