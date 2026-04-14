// ShoppingListPage — displays ingredients the user needs to buy
// Owner: Patrick Rucker

import { useRecipeContext } from '../context/RecipeContext'
import { useAuth0 } from '@auth0/auth0-react'
import AccessButton from '../components/AccessButtons/AccessButton'
import styles from './ShoppingListPage.module.css'

function ShoppingListPage() {
  const { shoppingList, toggleShoppingListItem, removeFromShoppingList, clearShoppingList } = useRecipeContext()
  const { isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: '1rem' }}>

        <p>Not Logged in!</p>
        <p>Please sign in to access your shopping list</p>

        <AccessButton variant="page"/>
      </div>
    )
  }

  if (shoppingList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h1>Shopping List</h1>
        <p>No items yet. Click "Add to Shopping List" on any recipe to add ingredients here!</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Shopping List</h1>
        <button onClick={clearShoppingList} className={styles.clearBtn}>
          Clear List
        </button>
      </div>
      <ul className={styles.list}>
        {shoppingList.map(item => (
          <li key={item.id} className={`${styles.item} ${item.checked ? styles.checked : ''}`}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleShoppingListItem(item.id)}
              />
              <span className={styles.text}>
                {item.amount > 0 && `${item.amount} `}
                {item.unit && `${item.unit} `}
                {item.name}
              </span>
            </label>
            <button
              onClick={() => removeFromShoppingList(item.id)}
              className={styles.removeBtn}
              title="Remove item"
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ShoppingListPage
