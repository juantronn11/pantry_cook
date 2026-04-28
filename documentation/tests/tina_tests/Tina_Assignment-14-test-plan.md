# Assignment 14 — Unit Test Plan (Tina)

**Author:** Tina Carter
**Sprint:** Spring 2026, Assignment 14
**Branch:** `SCRUM-171-unit-testing-planning--and-documentation--tina` (planning), `SCRUM-172-unit-test-creation---tina`

### Framework
- **Vitest 4** — already in `package.json` (`npm test`)
- **@testing-library/react** — for the `.jsx` context test
- Reporter: Vitest HTML reporter for committed results — output at `documentation/tests/tina_tests/results/index.html`
- Config: `vitest.tina.config.js` — isolated from teammates, no shared output

---

### How to run
```
npm test:tina                ← run's only Tina's tests + generate HTML reports
```

### Results location
`documentation/tests/tina_tests/results/`
- `index.html` + `assets/` — browsable Vitest HTML report

---

## My 3 Tests

### 1. Print/Download Formatting in — `DownloadButton.jsx`

- [src/components/DownloadButton/DownloadButton.jsx](../../src/components/DownloadButton/DownloadButton.jsx) — download trigger, blob/file output

- **Feature:** Print/Download Document Formatting in (SCRUM-25) .
- **Code under test:** DownloadButton in [src/components/DownloadButton/DownloadButton.jsx](../../../src/components/DownloadButton/DownloadButton.jsx)
- **Why test it:** This is an isolated button that should have individual tests outside of the whole app before being implemented. Correct formatting on a print PDF is a basic expectation of users in most webapps.
- **Fields / return objects asserted:**
  - 

### 2. merge method and return deduped ingredient list — `mergeIngredients.js`

- **Feature:** Duplicate recipes returned across different API calls are merged into a single entry. (SCRUM-44) .
- **Code under test:** mergeIngredients function in [src/utils/mergeIngredients.js](../../src/utils/mergeIngredients.js)
- **Why test it:** Having non-duplicated and correctly merged lists from both/all APIs is a basic expectation of a smooth user experiance.
- **Fields / return objects asserted:**
  - 

### 3. Shopping List Rendering Added and Removed Element — `ShoppingList.jsx` `ShpppingListButton.jsx`

- **Feature:** Shopping List Renders (SCRUM-122) with added ingredients from recipes and manually. Ingredients can be removed individually and list can be group cleared.
- **Code under test:** handleAddCustomItem in [src/components/ShoppingList/ShoppingList.jsx](../../../src/components/ShoppingList/ShoppingList.jsx) and addToShoppingList, addCustomItem, removeFromShoppingList, and clearShoppingList from [src/context/ShoppingListContext.jsx](../../../src/context/ShoppingListContext.jsx).
- **Why test it:** This is a new/seperate feature that should have all it's componant pieces working seperate from the main app before it is implemented 'publicly' and thus should have independant tests.
- **Fields / return objects asserted:**
  - 
