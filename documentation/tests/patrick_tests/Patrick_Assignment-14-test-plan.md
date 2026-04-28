# Assignment 14 — Unit Test Plan (Patrick)

**Author:** Patrick Rucker
**Sprint:** Spring 2026, Assignment 14
**Branch:** `SCRUM-168-unit-testing-planning` (planning), `SCRUM-170-create-unit-tests.-generate-re` (implementation)

### Framework
- **Vitest 4** — already in `package.json`
- **@testing-library/react** — for the `.jsx` context test
- Reporter: Vitest HTML reporter for committed results

---

### How to run
```
npm run test:patrick    ← run Patrick's tests only, generates HTML report
```

### How to view the HTML report
The Vitest HTML report fetches its data at runtime, so opening `index.html` directly in a browser (via `file://`) renders a blank page. Serve it over HTTP instead:

```
npx vite preview --outDir documentation/tests/patrick_tests/results
```

Then open the printed `http://localhost:4173/` URL in a browser — the report loads automatically (no extra path needed). Alternatively, right-click `index.html` in VS Code and choose **Open with Live Server** (requires the Live Server extension).
<!--  -->
### Repo layout (this folder)
```
documentation/tests/patrick_tests/
  Patrick_Assignment-14-test-plan.md  ← this file
  setup.js                            ← Vitest setup (jsdom + cleanup hooks)
  ThemeContext.test.jsx
  spoonacular.test.js
  withTimeout.test.js
  results/
    index.html                        ← generated HTML report (served via vite preview)
```

### Quick links
- **Results:** [results/index.html](results/index.html)
- **Test files:**
  - [ThemeContext.test.jsx](ThemeContext.test.jsx)
  - [spoonacular.test.js](spoonacular.test.js)
  - [withTimeout.test.js](withTimeout.test.js)
- **Setup:** [setup.js](setup.js)

---

## My 3 Tests

### 1. Dark mode persistence — `ThemeContext.jsx`

- **Test file:** [ThemeContext.test.jsx](ThemeContext.test.jsx)
- **Feature:** Theme toggle (SCRUM-162) that persists across sessions.
- **Code under test:** `ThemeProvider` component + `useTheme()` hook in [src/context/ThemeContext.jsx](../../../src/context/ThemeContext.jsx).
- **Why test it:** Context provider with state, side effects (localStorage), and a returned hook value — not a trivial getter.
- **Fields / return objects asserted:**
  - Hook returns `{ theme, toggleTheme }` — both fields present, `theme` is `'light' | 'dark'`, `toggleTheme` is a function.
  - Initial `theme` reads from `localStorage.getItem('pantry-cook-theme')` when present.
  - `toggleTheme()` flips the `theme` field `'light' ↔ 'dark'` and writes the new value back to localStorage.
  - Default value (no localStorage entry) is `'light'`.

### 2. Spoonacular API call — `spoonacular.js`

- **Test file:** [spoonacular.test.js](spoonacular.test.js)
- **Feature:** Ingredient autocomplete for the search form (SCRUM-27, SCRUM-39) plus the SCRUM-116 call counter.
- **Code under test:** `ingredientAutocomplete()`, `getAutocompleteCallCount()`, and `resetAutocompleteCallCount()` exports in [src/api/spoonacular.js](../../../src/api/spoonacular.js).
- **Why test it:** Direct API call with URL construction, query params, response parsing, and module-level counter state — "mock fetch, assert request + returned object + side-effect counter" territory.
- **Fields / return objects asserted:**
  - `fetch` mock called with the correct URL and query string (`query`, `number=10`, `apiKey`, `language=en`).
  - Success path returns the parsed JSON array from `res.json()`.
  - Non-OK response throws an `Error` whose `message` names the failed query.
  - `getAutocompleteCallCount()` returns a number that **increments by 1** each call.
  - `resetAutocompleteCallCount()` returns the counter to `0`.

### 3. Promise timeout utility — `withTimeout.js`

- **Test file:** [withTimeout.test.js](withTimeout.test.js)
- **Feature:** API call timeout protection (used by Spoonacular and MealDB wrappers).
- **Code under test:** `withTimeout(promise, ms)` method in [src/utils/withTimeout.js](../../../src/utils/withTimeout.js).
- **Why test it:** Pure method with a clear contract — two branches (resolve vs. timeout) and a return value in each.
- **Fields / return objects asserted:**
  - Returns a `Promise`.
  - When the inner promise resolves before `ms`, the returned promise resolves with the **same value** (identity check).
  - When `ms` elapses first, the returned promise **rejects** with a timeout error whose `message` field matches the expected string.
  - Fake timers used (`vi.useFakeTimers()`) so the timeout branch is deterministic.