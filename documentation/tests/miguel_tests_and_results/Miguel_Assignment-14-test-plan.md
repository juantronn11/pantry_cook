# Assignment 14 — Unit Test Plan

**Author:** Miguel Alvarez
**Sprint:** Spring 2026, Assignment 14
**Branch:** `SCRUM-176-unit-testing-planning` (planning), `SCRUM-176-create-unit-tests` (implementation)

### Framework
- **Vitest 4** — already in `package.json`
- **@testing-library/react** — for `.jsx` component tests
- **supertest** — for Express route tests in `mongo.js`
- Reporter: Vitest HTML reporter for committed results

---

### How to run
```
npm test                ← watch mode
npm run test:report     ← one-shot run + regenerate HTML report
```

### How to view the HTML report
The Vitest HTML report fetches its data at runtime, so opening `index.html` directly in a browser (via `file://`) renders a blank page. Serve it over HTTP instead:

```
npx vite preview --outDir documentation/tests/results
```

Then open the printed `http://localhost:4173/` URL in a browser. Alternatively, right-click `index.html` in VS Code and choose **Open with Live Server**.

### Repo layout (this folder)
```
documentation/tests/
  unit-test-plan.md              ← this file
  setup.js                       ← Vitest setup (jsdom + cleanup hooks)
  mongo.test.js
  RecipeGrid.test.jsx
  RecipeTile.test.jsx
  results/
    index.html                   ← generated HTML report (served via vite preview)
```

### Quick links
- **Results:** [results/index.html](results/index.html)
- **Test files:**
  - [mongo.test.js](mongo.test.js)
  - [RecipeGrid.test.jsx](RecipeGrid.test.jsx)
  - [RecipeTile.test.jsx](RecipeTile.test.jsx)
- **Setup:** [setup.js](setup.js)

---

## My 3 Tests

---

### 1. Express API routes — `mongo.js`

- **Test file:** [mongo.test.js](mongo.test.js)
- **Feature:** Backend REST API for user accounts and saved recipes (used by auth flow, saved recipes library, and shopping list).
- **Code under test:** Route handlers in [server/mongo.js](../../../server/mongo.js) — specifically `POST /api/user`, `GET /api/user`, `PUT /api/recipe`, and `DELETE /api/recipe`.
- **Why test it:** Each route has multiple branches (success, missing body fields, not-found, internal error) and interacts with MongoDB. Mocking the MongoDB collection lets us assert the correct response codes and bodies for each branch without a live database.
- **Approach:** Mock `MongoClient` and the `collections` / `errorLogs` collection objects with `vi.mock`. Use `supertest` to fire HTTP requests against the Express `app` instance directly (no port needed). Mock `req.auth.payload.email` via the `checkJwt` middleware stub.
- **Fields / return objects asserted:**

  **`POST /api/user`**
  - When the user does **not** exist: calls `collections.insertOne()` with `{ email, recipes: [] }`, responds `201` with `{ _id, email, recipes: [] }`.
  - When the user **already exists**: responds `200` with `{ created: false, ...existingUser }` and does **not** call `insertOne`.
  - On a thrown error: responds `500` with `{ error: 'Internal server error' }` and calls `errorLogs.insertOne()`.

  **`GET /api/user`**
  - When user is found: responds `200` with the full user document.
  - When user is **not** found (`findOne` returns `null`): responds `404`.

  **`PUT /api/recipe`**
  - When `req.body.recipe` is present and the update matches: responds `200`.
  - When `req.body.recipe` is **missing**: responds `400` with `{ error: 'Recipe is required' }`.
  - When `modifiedCount === 0` (user not found): responds `404`.

  **`DELETE /api/recipe`**
  - When `req.body.recipeId` is present and the pull succeeds: responds `200` with `{ message: 'Recipe deleted successfully' }`.
  - When `req.body.recipeId` is **missing**: responds `400` with `{ error: 'recipeId is required' }`.

---

### 2. Recipe grid rendering — `RecipeGrid.jsx`

- **Test file:** [RecipeGrid.test.jsx](RecipeGrid.test.jsx)
- **Feature:** The main recipe results grid (SCRUM-79/110) including loading overlay, empty states, and prop-vs-context recipe source selection.
- **Code under test:** `RecipeGrid` component in [src/components/RecipeGrid/RecipeGrid.jsx](../../../src/components/RecipeGrid/RecipeGrid.jsx).
- **Why test it:** The component has conditional rendering across several states (loading, empty + ingredients, empty + no ingredients, populated), reads from two recipe sources (`recipesProp` prop vs. context), and triggers a `scrollIntoView` side-effect. These branches are easy to miss in manual QA.
- **Approach:** Mock `useRecipeContext` with `vi.mock` to inject controlled state (`recipes`, `loading`, `ingredients`, `excludedIngredients`). Stub `RecipeTile` as a simple `<div data-testid="recipe-tile">` so the test stays focused on the grid. Stub `scrollIntoView` on `window.HTMLElement.prototype` to avoid jsdom errors.
- **Fields / return objects asserted:**

  - **Loading state** (`loading: true`): renders an `<img>` with `alt="Loading... maybe"` (the loading spinner); recipe tiles are **not** rendered.
  - **Empty state with ingredients and excluded items**: renders the message `'No recipes found — try removing some excluded ingredients.'` and no tiles.
  - **Empty state with ingredients and no excluded items**: renders `'No recipes found. Try adding some ingredients to search!'`.
  - **Populated state**: renders one `[data-testid="recipe-tile"]` element per recipe in the array; no empty-state message is present.
  - **`recipesProp` override**: when the `recipes` prop is passed directly, those recipes are rendered instead of the context recipes — confirmed by tile count matching the prop array length, not the context array length.

---

### 3. Recipe tile modal and save toggle — `RecipeTile.jsx`

- **Test file:** [RecipeTile.test.jsx](RecipeTile.test.jsx)
- **Feature:** Individual recipe card interaction — opening the detail modal, saving/removing a recipe, image error fallback, and the servings adjustment control (SCRUM-164).
- **Code under test:** `RecipeTile` component in [src/components/RecipeTile/RecipeTile.jsx](../../../src/components/RecipeTile/RecipeTile.jsx).
- **Why test it:** `RecipeTile` is the most interactive component in the app. Its `clickHandler`, `handleSaveToggle`, `handleImageError`, and servings state all have distinct code paths. The modal is conditionally rendered; the save button is conditionally shown based on `isAuthenticated`. These interactions are the most likely to regress.
- **Approach:** Mock `useRecipeContext` to provide `saveRecipe`, `removeSavedRecipe`, and `isRecipeSaved`. Mock `useAuth0` to control `isAuthenticated`. Supply a minimal `recipe` fixture with `raw` data shaped to what `toModalFormat` expects. Use `@testing-library/react` `fireEvent` / `userEvent` for clicks.
- **Fields / return objects asserted:**

  **Modal open / close**
  - Before clicking the thumbnail: the modal overlay is **not** in the DOM.
  - After clicking the thumbnail: the modal renders `strMeal` title, category, area, cook time, and ingredients list.
  - After clicking the `X` close button or the overlay backdrop: the modal is **removed** from the DOM.

  **Save / remove toggle (authenticated)**
  - When `isRecipeSaved` returns `false` and the user clicks "Save to Library": `saveRecipe` is called with the recipe object.
  - When `isRecipeSaved` returns `true` and the user clicks "Remove from Library": `removeSavedRecipe` is called with `recipe.id`.
  - When `saveRecipe` throws: the error message `'Failed to save. Check your network connection or try logging out and back in.'` appears in the modal.
  - When `isAuthenticated` is `false`: the save button is **not** rendered at all.

  **Image error fallback**
  - When the thumbnail `<img>` fires an `onError` event: the `src` attribute is replaced with the `errorThumb` import value; the `alt` attribute becomes `'Error'`.

  **Servings control (authenticated)**
  - Initial `servings` value equals `recipe.raw.servings`.
  - Clicking `+` increments the displayed servings count by 1.
  - Clicking `-` decrements by 1; the button is disabled when servings is `1`.
  - Clicking "Reset" returns servings to `recipe.raw.servings` and the Reset button becomes disabled.
