// ExcludeIngredients — SCRUM-104
// Allows the user to specify ingredients they want excluded from recipe results.
// Renders an input + add button, and displays excluded items as removable chips.
// Local state only in this SCRUM — wired to RecipeContext in SCRUM-106.

import { useState } from 'react'

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
    <div>
      <label htmlFor="exclude-input">Exclude ingredients:</label>
      <input
        id="exclude-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. peanuts"
      />
      <button onClick={handleAdd}>+ Add</button>

      {excluded.length > 0 && (
        <div>
          {excluded.map(item => (
            <span key={item}>
              {item}
              <button onClick={() => setExcluded(prev => prev.filter(i => i !== item))}>✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExcludeIngredients
