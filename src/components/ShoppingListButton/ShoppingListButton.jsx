// ShoppingListButton component — Owner: Tina Carter
// connects to generation of shopping list for individual recipes
// Renders on each RecipeTile

import styles from './ShoppingListButton.module.css'
//replce ↓ with your shopping list generation function:
// placeholder → ShoppingList  
//import placeHolder from '../ShoppingList/ShoppingList.jsx'

function ShoppingListButton() {
  return (
    <button className={styles.listButton} onClick={() => {
      // This button only renders inside the modal when recipe data loaded because it is implemented on RecipeTile
      // Patrick, replace line 13 (window.alert()) with your shopping list when you implement it.
      // I am assuming that you are wanting a popup similar to recipe tile that will display the shopping list.
            window.alert('This is not yet a functional button. Patrick, you should get on that /j.');
    }}>
      Generate Shopping List
    </button>
  )
}

export default ShoppingListButton