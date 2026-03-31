// ExcludeIngredients — SCRUM-104/106
// Allows the user to specify ingredients they want excluded from recipe results.
// SCRUM-106: Wired to RecipeContext — uses excludedIngredients, addExclusion,
// and removeExclusion instead of local state. Actual filtering in SCRUM-108.

import { useState } from 'react'
import { useRecipeContext } from '../../context/RecipeContext'
import { ingredientAutocomplete } from '../../utils/ingredientTrie'
import styles from './ExcludeIngredients.module.css'

function ExcludeIngredients() {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const { excludedIngredients, addExclusion, removeExclusion } = useRecipeContext()

  function handleInput(e) {
    const value = e.target.value
    setInputValue(value)
    setSuggestions(value.trim() ? ingredientAutocomplete(value) : [])
  }

  function handleSelect(ingredient) {
    addExclusion(ingredient)
    setInputValue('')
    setSuggestions([])
  }

  function handleAdd() {
    const trimmed = inputValue.trim().toLowerCase()
    if (!trimmed) return
    addExclusion(trimmed)
    setInputValue('')
    setSuggestions([])
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className={styles.container}>
      <label htmlFor="exclude-input" className={styles.label}>Exclude ingredients:</label>
      <div className={styles.inputRow}>
        <div className={styles.inputWrapper}>
          <input
            id="exclude-input"
            type="text"
            className={styles.input}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="e.g. peanuts"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map(s => (
                <li key={s} onMouseDown={() => handleSelect(s)}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
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
