// HistoryPage — displays user's recipe search history
// Owner: Patrick Rucker

import { useRecipeContext } from '../context/RecipeContext'
import RecipeGrid from '../components/RecipeGrid/RecipeGrid'
import ClearHistoryButton from '../components/ClearHistoryButton/ClearHistoryButton';

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
    <>
      <div>
        <h1>Search History</h1>
        {historyRecipes.map(entry => (
          <section key={entry.id}>
            <h3>
              Searched: {entry.ingredients.join(', ')}
              <small> — {new Date(entry.timestamp).toLocaleString()}</small>
            </h3>
            <RecipeGrid recipes={entry.recipes} />
          </section>
        ))}
      </div>
      <ClearHistoryButton></ClearHistoryButton>
    </>
  )
}

export default HistoryPage
