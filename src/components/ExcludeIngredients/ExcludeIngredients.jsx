// ExcludeIngredients — SCRUM-104/106
// Allows the user to specify ingredients they want excluded from recipe results.
// SCRUM-106: Wired to RecipeContext — uses excludedIngredients, addExclusion,
// and removeExclusion instead of local state. Actual filtering in SCRUM-108.

import { useState } from 'react'
import { useRecipeContext } from '../../context/RecipeContext'
import styles from './ExcludeIngredients.module.css'

function ExcludeIngredients() {
  const [inputValue, setInputValue] = useState('')
  const { excludedIngredients, addExclusion, removeExclusion } = useRecipeContext()

  function handleAdd() {
    const trimmed = inputValue.trim().toLowerCase()
    if (!trimmed) return
    addExclusion(trimmed)
    setInputValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className={styles.container}>
      <label htmlFor="exclude-input" className={styles.label}>Exclude ingredients:</label>
      <div className={styles.inputRow}>
        <input
          id="exclude-input"
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. peanuts"
        />
        <button className={styles.addButton} onClick={handleAdd}>+ Add</button>
      </div>

      {excludedIngredients.length > 0 && (
        <div className={styles.chipList}>
          {excludedIngredients.map(item => (
            <span key={item} className={styles.chip}>
              {item}
              <button className={styles.removeButton} onClick={() => removeExclusion(item)}>✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExcludeIngredients
