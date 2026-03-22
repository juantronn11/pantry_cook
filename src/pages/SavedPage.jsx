// SavedPage — displays user's saved recipe collection
// Owner: Patrick Rucker

import { useRecipeContext } from '../context/RecipeContext'

function SavedPage() {
  const { savedRecipes } = useRecipeContext()

  if (savedRecipes.length === 0) {
    return (
      <div>
        <h1>My Saved Recipes</h1>
        <p>No saved recipes yet. Click "Save to Library" on any recipe to add it here!</p>
      </div>
    )
  }

  return (
    <div>
      <h1>My Saved Recipes</h1>
    </div>
  )
}

export default SavedPage
