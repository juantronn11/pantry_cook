// HistoryPage — displays user's recipe search history
// Owner: Patrick Rucker

import { useRecipeContext } from '../context/RecipeContext'

function HistoryPage() {
  const { historyRecipes } = useRecipeContext()

  if (historyRecipes.length === 0) {
    return (
      <div>
        <h1>Search History</h1>
        <p>No search history yet. Try searching for some recipes!</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Search History</h1>
    </div>
  )
}

export default HistoryPage
