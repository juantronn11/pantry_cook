import { useRecipeContext } from '../../context/RecipeContext'
import {useState} from 'react'
import styles from './ShoppingListPage.module.css'

function ShoppingList() {
    const { shoppingList, toggleShoppingListItem, removeFromShoppingList, clearShoppingList, addCustomItem } = useRecipeContext()


    const [inputValue, setInputValue] = useState('')

    console.log(shoppingList)

    const handleAddCustomItem = () => {
        const trimmed = inputValue.trim()

        if (!trimmed) return

        addCustomItem(trimmed)
        setInputValue('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAddCustomItem()
    }

    return (

        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Shopping List</h1>
                {shoppingList.length > 0 && (
                    <button onClick={clearShoppingList} className={styles.clearBtn}>
                        Clear List
                    </button>
                )}
            </div>

            <div className={styles.addItem}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add item (e.g. paper towels)"
                    className={styles.addItemInput}
                />
                <button
                    onClick={handleAddCustomItem}
                    className={styles.addItemBtn}
                    disabled={!inputValue.trim()}
                >
                    + Add
                </button>
            </div>

            {shoppingList.length === 0 ? (
                <p className={styles.emptyState}>
                    No items yet. Add one above or click "Add to Shopping List" on any recipe!
                </p>
            ) : (
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
            )}
        </div>
    )
}

export default ShoppingList