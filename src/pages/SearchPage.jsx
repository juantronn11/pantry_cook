// SearchPage — Main page
// Composes SearchForm + RecipeGrid components

import { fetchMealDBRecipes } from '../api/mealdb'
import { fetchSpoonacularRecipes } from '../api/spoonacular'

// TEMP TEST — remove before commit
fetchMealDBRecipes(['chicken']).then(console.log).catch(console.error)
fetchSpoonacularRecipes(['chicken']).then(console.log).catch(console.error)

function SearchPage() {
  return (
    <div>
      <h1>Search Recipes</h1>
      <p>SearchPage placeholder — will contain SearchForm and RecipeGrid</p>
    </div>
  )
}

export default SearchPage
