// ShoppingListButton component — Owner: Tina Carter
// Wired to shopping list — Owner: Patrick Rucker
// Adds a recipe's ingredients to the shopping list

import styles from './ShoppingListButton.module.css'
import { useRecipeContext } from '../../context/RecipeContext'

function ShoppingListButton({ recipe }) {
  const { addToShoppingList } = useRecipeContext()

  return (
    <button className={styles.listButton} onClick={() => {
      addToShoppingList(recipe)
    }}>
      Add to Shopping List
    </button>
  )
}

export default ShoppingListButton
