# SCRUM-149 Testing Guide — Category-Based Ingredient Exclusion

## What Was Built
Users can now type recognized dietary category terms (e.g. "dairy", "gluten") in the Exclude Ingredients field. These are routed to Spoonacular's `&intolerances=` param instead of `&excludeIngredients=`, so Spoonacular handles the full category mapping server-side.

Recognized terms: `dairy, egg, gluten, peanut, seafood, sesame, shellfish, soy, sulfite, tree nut, wheat`

Specific ingredient exclusions (e.g. "peanuts", "milk") still work as before via `&excludeIngredients=`.

---

## How to Test

### Setup
1. Run the server: `node ./server/mongo.js`
2. Run the frontend: `npm run dev`
3. Open the app and log in

---

### Test 1 — Category term routes to intolerances
1. Enter at least one ingredient in the search bar (e.g. "pasta")
2. In the Exclude Ingredients field, type `dairy` and click Add
3. Click Search

**Expected:**
- "dairy" chip appears in **accent color** (distinct from regular exclusion chips)
- Results do not contain dairy-based recipes (e.g. no cream-heavy pasta dishes)
- Spoonacular receives `&intolerances=dairy` in the request (check Network tab in DevTools)

---

### Test 2 — Specific ingredient still works as before
1. In the Exclude Ingredients field, type `mushrooms` and click Add
2. Click Search

**Expected:**
- "mushrooms" chip appears in the **default gray** chip style
- Results do not contain recipes with mushrooms
- Spoonacular receives `&excludeIngredients=mushrooms` in the request

---

### Test 3 — Both types work together
1. Add `gluten` (category) and `onions` (ingredient) as exclusions
2. Click Search

**Expected:**
- Two chip types visible — accent chip for "gluten", gray chip for "onions"
- Results exclude both gluten-containing recipes and recipes with onions
- Network request contains both `&intolerances=gluten` and `&excludeIngredients=onions`

---

### Test 4 — Chips remove correctly
1. Add `dairy` and `eggs` as exclusions
2. Click ✕ on the "dairy" chip
3. Click Search

**Expected:**
- "dairy" chip removed, `&intolerances=` no longer in the request
- "eggs" chip remains and `&excludeIngredients=eggs` still sent

---

### Test 5 — New Search clears intolerances
1. Add `gluten` as a category exclusion
2. Click the "New Search" button in the navbar

**Expected:**
- All chips cleared including intolerance chips
- Next search starts with no exclusions or intolerances

---

### Test 6 — Case insensitive input
1. Type `Dairy` or `DAIRY` and click Add

**Expected:**
- Recognized as an intolerance term and shows as an accent chip
- Behaves the same as typing `dairy`
