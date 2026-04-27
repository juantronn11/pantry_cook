// ExcludeIngredients — SCRUM-104/106
// Allows the user to specify ingredients they want excluded from recipe results.
// SCRUM-106: Wired to RecipeContext — uses excludedIngredients, addExclusion,
// and removeExclusion instead of local state. Actual filtering in SCRUM-108.

import { useState } from 'react'
import { useRecipeContext } from '../../context/RecipeContext'
import { ingredientAutocomplete } from '../../utils/ingredientTrie'
import { isIntolerance, INTOLERANCE_TERMS } from '../../utils/intolerances'
import styles from './ExcludeIngredients.module.css'

function ExcludeIngredients() {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const {
    excludedIngredients, addExclusion, removeExclusion,
    intolerances, addIntolerance, removeIntolerance,
  } = useRecipeContext()

  function handleInput(e) {
    const value = e.target.value
    setInputValue(value)
    if (!value.trim()) {
      setSuggestions([])
      return
    }
    const lower = value.trim().toLowerCase()
    const matchingIntolerances = INTOLERANCE_TERMS.filter(t => t.startsWith(lower))
    const ingredientSuggestions = ingredientAutocomplete(value)
    setSuggestions([...matchingIntolerances, ...ingredientSuggestions])
  }

  function handleSelect(ingredient) {
    addExclusion(ingredient)
    setInputValue('')
    setSuggestions([])
  }

  function handleKeySelection(event) {
    // if no suggestions, you can't scroll through suggestions
    if (!suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
      if (activeIndex + 1 >= suggestions.length) {setActiveIndex(0)}
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
      if (activeIndex - 1 < 0) {setActiveIndex(suggestions.length - 1)}
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      }
      else handleKeyDown(event);
    }
  }

  function handleAdd() {
    const trimmed = inputValue.trim().toLowerCase()
    if (!trimmed) return
    if (isIntolerance(trimmed)) {
      addIntolerance(trimmed)
    } else {
      addExclusion(trimmed)
    }
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
            onKeyDown={handleKeySelection}
            aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            placeholder="e.g. peanuts"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map(s => (
                <li
                  key={s}
                  onMouseDown={() => handleSelect(s)}
                  data-hover={activeIndex === suggestions.indexOf(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className={styles.addButton} onClick={handleAdd}>+ Add</button>
      </div>

      {(intolerances.length > 0 || excludedIngredients.length > 0) && (
        <div className={styles.chipList}>
          {intolerances.map(item => (
            <span key={item} className={`${styles.chip} ${styles.chipCategory}`}>
              {item}
              <button className={styles.removeButton} onClick={() => removeIntolerance(item)}>✕</button>
            </span>
          ))}
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
