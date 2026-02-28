// SearchPage — Main page
// Composes SearchForm + RecipeGrid components
import SearchForm from '../components/SearchForm/SearchForm'
import RecipeGrid from '../components/RecipeGrid/RecipeGrid'

function SearchPage() {
  return (
    <div>
      <h1>Search Recipes</h1>

      <SearchForm />
      <RecipeGrid/>

    </div>
  )
}

export default SearchPage
