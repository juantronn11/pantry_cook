// ShoppingListButton component — Owner: Tina Carter
// Wired to shopping list — Owner: Patrick Rucker
// Adds a recipe's ingredients to the shopping list


// User Story 17: SCRUM-166 "Add to Shopping List" button visibly informs user it worked (or didn't)
// Owner: Tina Carter
// Button turns green upon success, and opens window.alert on failure.
// Using component state to reflect temporary UI feedback instead of
// mutating the DOM directly (prevents React from overwriting changes).
import styles from './ShoppingListButton.module.css'
import { useState } from 'react'

import { useShoppingListContext } from '../../context/ShoppingListContext'

function ShoppingListButton({ recipe }) {
  const { addToShoppingList } = useShoppingListContext()  
  const [success, setSuccess] = useState(false)
  const handleClick = async () => {
        try {
          await addToShoppingList(recipe)
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
          window.alert("There was an issue adding this recipe to your shopping list. Please try again.")
          console.error("Error adding recipe to shopping list:", error)
        }
    }
  return (
    <button id="shopButton" className={styles.listButton} style={{backgroundColor : success ? 'rgb(0, 139, 12)' : 'rgb(173, 216, 230)'}} onClick={handleClick}>
      Add to Shopping List
    </button>
  )
}

export default ShoppingListButton