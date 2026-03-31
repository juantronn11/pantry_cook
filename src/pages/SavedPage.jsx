// SavedPage — displays user's saved recipe collection
// Owner: Patrick Rucker

import { useRecipeContext } from '../context/RecipeContext'
import RecipeGrid from '../components/RecipeGrid/RecipeGrid'
import { useAuth0 } from "@auth0/auth0-react";
import AccessButton from '../components/AccessButtons/AccessButton';

function SavedPage() {
  const { savedRecipes } = useRecipeContext();
  const {isAuthenticated} = useAuth0();

  if(!isAuthenticated){
    return (
      <div style={{ display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', 
        minHeight: '60vh', gap: '1rem' }}>

        <p>Not Logged in!</p>
        <p>Please sign in to access saved recipes</p>
        
        <AccessButton variant="page"/>
      </div>
    )
  }

  return (savedRecipes.length > 0) ? (
      <div>
        <h1>My Saved Recipes</h1>
        <RecipeGrid recipes={savedRecipes} />
      </div>
  ) : (
    <div>
        <h1>My Saved Recipes</h1>
        <p>No saved recipes yet. Click "Save to Library" on any recipe to add it here!</p>
      </div>
  )
}

export default SavedPage
