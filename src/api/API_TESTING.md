# API Testing Guide — SCRUM-16 & SCRUM-17

This guide explains how to manually verify that the MealDB and Spoonacular API services are making successful calls per ingredient.

---

## How to Test

### 1. Add temporary test calls to `SearchPage.jsx`

At the top of `src/pages/SearchPage.jsx`, add:

```js
import { fetchMealDBRecipes } from '../api/mealdb'
import { fetchSpoonacularRecipes } from '../api/spoonacular'

// TEMP TEST — remove before final commit
fetchMealDBRecipes(['chicken']).then(console.log).catch(console.error)
fetchSpoonacularRecipes(['chicken']).then(console.log).catch(console.error)
```

### 2. Start the dev server

```bash
npm run dev
```

### 3. Open the browser

Go to `http://localhost:5173` and open **DevTools → Console tab**.

---

## What to Look For

### MealDB — Success
An array of meal objects logged to the console:
```
[
  { idMeal: '52940', strMeal: 'Brown Stew Chicken', strCategory: 'Chicken', strArea: 'Jamaican', ... },
  { idMeal: '53161', strMeal: 'Chicken & chorizo rice pot', ... },
  ...
]
```

### Spoonacular — Success
An array of recipe objects logged to the console:
```
[
  { id: 123, title: 'Chicken Alfredo', image: '...', nutrition: {...}, ... },
  ...
]
```

### Failure — What an error looks like
```
Error: MealDB search failed for "chicken": 401
Error: Spoonacular search failed for "chicken": 402
```
- `401` / `403` → API key issue (check `.env` file)
- `404` → wrong endpoint URL
- `Network Error` → no internet or CORS issue

---

## Testing Multiple Ingredients

To verify one call fires per ingredient, update the test:

```js
fetchMealDBRecipes(['chicken', 'garlic', 'rice']).then(console.log).catch(console.error)
```

Open **DevTools → Network tab** and filter by `Fetch/XHR`.
You should see **3 separate requests** to `filter.php` — one for each ingredient.

---

## Cleanup

Remove the test imports and calls from `SearchPage.jsx` before the final PR merge.

---

# SCRUM-17 — Testing Concurrent API Calls

This section explains how to verify that multiple ingredient searches fire **simultaneously** instead of one at a time.

## How to Test Concurrency

### 1. Add multi-ingredient test to `SearchPage.jsx`

```js
import { fetchMealDBRecipes } from '../api/mealdb'
import { fetchSpoonacularRecipes } from '../api/spoonacular'

// TEMP TEST — remove before final commit
fetchMealDBRecipes(['chicken', 'garlic']).then(console.log).catch(console.error)
fetchSpoonacularRecipes(['chicken', 'garlic']).then(console.log).catch(console.error)
```

### 2. Start the dev server

```bash
npm run dev
```

### 3. Open DevTools → Network tab

Go to `http://localhost:5173`, open **DevTools → Network tab**, filter by **Fetch/XHR**.

---

## What to Look For

### Concurrent requests — Success
You should see **2 MealDB requests start at the same timestamp**:
```
filter.php?i=chicken   ← starts at ~0ms
filter.php?i=garlic    ← starts at ~0ms  (same time, not after chicken finishes)
```
And **2 Spoonacular requests start at the same timestamp**:
```
findByIngredients?ingredients=chicken  ← starts at ~0ms
findByIngredients?ingredients=garlic   ← starts at ~0ms
```

If the requests were **sequential**, garlic would only start AFTER chicken finishes — you would see a clear gap in the timestamps.

### Console — Success
```
[{idMeal: '52940', strMeal: 'Brown Stew Chicken', ...}, ...] ← MealDB results (array)
[{id: 123, title: 'Chicken Alfredo', ...}, ...]              ← Spoonacular results (array)
```

### Spoonacular 402 — Rate limit hit (not a code bug)
```
GET .../findByIngredients?ingredients=chicken... 402 (Payment Required)
[]
```
- `402` means the free tier daily limit (150 requests/day) was exceeded from testing
- Returning `[]` instead of crashing = **correct behavior** — `Promise.allSettled()` handles this gracefully
- Key will reset the next day
- MealDB results will still be returned even when Spoonacular fails

---

## Cleanup

Remove the test imports and calls from `SearchPage.jsx` before the final PR merge.
