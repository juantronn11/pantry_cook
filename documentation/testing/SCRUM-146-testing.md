# SCRUM-146 — User-Facing Error Handler for Recipe Save Failure

**User Story 22:** Improved Search & Error Handling  
**Branch:** `SCRUM-146-add-user-facing-error-handler-`  
**PR Flag:** None

---

## What This Covers

When a recipe fails to save or be removed from the library, the user now sees an actionable error message inside the modal instead of a silent failure.

---

## What Changed

### `src/context/RecipeContext.jsx`
- `saveRecipe` and `removeSavedRecipe` now re-throw errors after rolling back state
- Previously the catch block was terminal — the component had no way to know a save failed

### `src/components/RecipeTile/RecipeTile.jsx`
- Added `saveError` state
- Extracted save button onClick into async `handleSaveToggle` with try/catch
- Error message displayed below the save button when save fails
- `saveError` clears when the modal is closed

---

## How to Test

### Happy path (save works)
1. Log in to the app
2. Search for any recipe and open the modal
3. Click **Save to Library** — button should toggle to **Remove from Library**
4. Click **Remove from Library** — button should toggle back
5. No error message should appear

### Error path (save fails)
1. Log in to the app
2. Open browser DevTools → **Network** tab
3. Click the **Offline** toggle to simulate no network
4. Open a recipe modal and click **Save to Library**
5. Expected: button reverts, red error message appears below the button:
   `"Failed to save. Check your network connection or try logging out and back in."`
6. Click X to close the modal — error message should be gone on next open

### Before this fix
- Save button appeared to do nothing on failure
- No feedback to the user — silent rollback only visible in console

---

## Reviewer Checklist

- [ ] Error message appears when save fails (test with network offline)
- [ ] Error message clears when modal is closed and reopened
- [ ] Save/remove still works correctly when network is available
