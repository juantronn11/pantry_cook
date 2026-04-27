# Assignment 14 — Unit Test Plan (Juan)

**Author:** Juan Estrada  
**Sprint:** Spring 2026, Assignment 14  
**Branch:** `SCRUM-169-unit-testing-planning`

### Framework
- **Vitest 4** — already in `package.json`
- **@testing-library/react** — for the ErrorBoundary component test
- Reporter: Vitest HTML reporter — output at `documentation/tests/juan_tests/results/index.html`
- Config: `vitest.juan.config.js` — isolated from teammates, no shared output

---

### How to run
```
npm run test:juan       ← run Juan's tests only, generates HTML report
```

Test files are in `documentation/tests/juan_tests/`

### How to view the HTML report
The Vitest HTML report fetches its data at runtime, so opening `index.html` directly in a browser (via `file://`) renders a blank page. Serve it over HTTP instead:

```
npx vite preview --outDir documentation/tests/juan_tests/results
```

---

## My 3 Tests

### 1. Frontend error logging — `logError.js`

- **Feature:** Persistent error logging (SCRUM-147/148) — replaces console.error with MongoDB-backed logging.
- **Code under test:** `logError(message, component, userId)` async method in [src/helperFunctions/logError.js](../../src/helperFunctions/logError.js).
- **Why test it:** Method with defined parameters that makes a structured API call — the POST body is a return object with specific fields that can be asserted.
- **Fields / return objects asserted:**
  - `fetch` called with method `POST` and correct URL `/errors`.
  - Request body contains all three fields: `message`, `component`, `userId`.
  - `component` defaults to `'unknown'` and `userId` defaults to `null` when not provided.
  - Does not throw when `fetch` rejects — silent fallback so logging never causes a recursive error loop.

### 2. React error boundary — `ErrorBoundary.jsx`

- **Feature:** Crash recovery UI (SCRUM-147) — catches render errors and shows a fallback instead of a blank page.
- **Code under test:** `ErrorBoundary` class component in [src/components/ErrorBoundary/ErrorBoundary.jsx](../../src/components/ErrorBoundary/ErrorBoundary.jsx).
- **Why test it:** Class with lifecycle methods (`getDerivedStateFromError`, `componentDidCatch`) and a `hasError` state field that drives conditional rendering — the rendered output is a verifiable return object.
- **Fields / return objects asserted:**
  - Renders children normally when no error is thrown (`hasError` is `false`).
  - Renders fallback UI heading and refresh button when a child throws (`hasError` flips to `true`).
  - Broken child content is not present in the DOM when `hasError` is `true`.

### 3. Recipe normalization — `normalizeRecipe.js`

- **Feature:** Consistent recipe shape across the app (SCRUM-46) — all Spoonacular results pass through this before display.
- **Code under test:** `normalizeSpoonacularRecipe(recipe)` pure method in [src/utils/normalizeRecipe.js](../../src/utils/normalizeRecipe.js).
- **Why test it:** Pure method with a clear contract — takes a structured input and returns a normalized object with defined fields, making it ideal for asserting return object shape.
- **Fields / return objects asserted:**
  - Returns an object with all required fields: `id`, `name`, `source`, `matchScore`, `raw`.
  - `id` is prefixed with `"spoonacular-"` concatenated with the raw recipe's `id` field.
  - `name` is lowercased and trimmed from `recipe.title`.
  - `source` is always the string `'spoonacular'`.
  - `matchScore` defaults to `0` when not present on the input object.
  - `raw` is the original recipe object passed through unchanged (identity check).
