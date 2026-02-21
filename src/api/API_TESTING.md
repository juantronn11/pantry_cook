# API Testing Guide — SCRUM-16

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
