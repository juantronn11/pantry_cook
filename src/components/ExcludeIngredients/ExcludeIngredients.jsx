// ExcludeIngredients — SCRUM-104
// Allows the user to specify ingredients they want excluded from recipe results.
// Renders an input + add button, and displays excluded items as removable chips.
// Local state only in this SCRUM — wired to RecipeContext in SCRUM-106.

import { useState } from 'react'
import styles from './ExcludeIngredients.module.css'

function ExcludeIngredients() {
  const [inputValue, setInputValue] = useState('')
  const [excluded, setExcluded] = useState([])

  function handleAdd() {
    const trimmed = inputValue.trim().toLowerCase()
    if (!trimmed || excluded.includes(trimmed)) return
    setExcluded(prev => [...prev, trimmed])
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

      {excluded.length > 0 && (
        <div className={styles.chipList}>
          {excluded.map(item => (
            <span key={item} className={styles.chip}>
              {item}
              <button className={styles.removeButton} onClick={() => setExcluded(prev => prev.filter(i => i !== item))}>✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExcludeIngredients
