// SearchForm component — Owner: Christina Johnson
// Multi-select ingredient buttons + Search button
// Validates at least one ingredient is selected before submission

import { useState, useEffect, useRef } from 'react';
import styles from './SearchForm.module.css';
import { useRecipeContext } from '../../context/RecipeContext';
import { ingredientAutocomplete } from '../../utils/ingredientTrie';
import ExcludeIngredients from '../ExcludeIngredients/ExcludeIngredients';

const MAX_INGREDIENTS = 5;

function SearchForm() {
  const { ingredients } = useRecipeContext();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const suggestionsRef = useRef(null);
  // useRef = reference a value not used for rendering // returns a CURRENT PROPERTY that is initially set to passed (null) value
  // changing ref DOES NOT trigger re-render, so good for non UI changable values, in this case WHICH dropdown ingredient is 'hovered',
  //  which should persist across renders but not trigger a re-render when it changes.
  // https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref

  // SCRUM-141: When context ingredients are cleared (e.g. via "New Search"),
  // sync the local form state so the UI reflects the reset.
  useEffect(() => {
    if (ingredients.length === 0) {
      setSelectedIngredients([]);
      setQuery('');
      setSuggestions([]);
    }
  }, [ingredients]);

  function handleInput(e) {
    const value = e.target.value;
    setQuery(value);
    setSuggestions(value.trim() ? ingredientAutocomplete(value) : []);
    setActiveIndex(-1);
  }

  function handleSelect(ingredient) {
    if (selectedIngredients.length >= MAX_INGREDIENTS) return;
    if (selectedIngredients.includes(ingredient)) return;
    setSelectedIngredients(prev => [...prev, ingredient]);
    setQuery('');
    setSuggestions([]);
  }

  // SCRUM-150 arrow keys can be used to navigate autocomplete suggestions, 
  // and Enter key selects both when arrow key 'hovers' and mouse hovers over a suggestion.
  // Owner: Tina Carter
  function handleKeySelection(event) {
    if (selectedIngredients.length >= MAX_INGREDIENTS) return;
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
    }
  }

  // SCRUM-165: Keep the active suggestion visible in the dropdown when keyboard navigating
  useEffect(() => {
    if (activeIndex < 0) return;
    const list = suggestionsRef.current;
    if (!list) return;
    const item = list.children[activeIndex];
    if (item && typeof item.scrollIntoView === 'function') {
      item.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  function handleRemove(ingredient) {
    setSelectedIngredients(prev => prev.filter(i => i !== ingredient));
  }

  return (
    <>
      <div className={styles.searchForm}>
        <label htmlFor="ingredients">
          Select up to {MAX_INGREDIENTS} ingredients
        </label>

      
        <p 
        // Code Purpose: handels the display of selected ingredient as tag, 
        // not the dropdown/autocomplete suggestions.
        />
        <div className={styles.selectedIngredients}>
          {selectedIngredients.map(ingredient => (
            <span key={ingredient} className={styles.tag}>
              {ingredient}
              <button onClick={() => handleRemove(ingredient)}>✕</button>
            </span>
          ))}
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            id="ingredients"
            name="name"
            value={query}
            onInput={handleInput}
            onKeyDown={handleKeySelection}
            aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            placeholder="Type an ingredient..."
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            // Code Purpose: lines 79-85 handel the creation of dropdown/autocomplete 
            // suggestions. onMouseDown() ~ onClick() but higher priority so it acts 
            // before dropdown unloads b/c another action is called (clicking)
            // Fix/Augment: presumably adding an 'onArrowDown' or similar to replicate 
            // 'hover' and 'onEnter' to replicate 'click' would make arrowkey selection possible.
            // Research: how to do BOTH as once, because we want to keep mouse functionality
            <ul
              className={styles.suggestions}
              role="listbox"
              ref={suggestionsRef}
              aria-label="ingredient suggestions"
            >
              {suggestions.map((s, idx) => (
                <li
                  id={`suggestion-${idx}`}
                  key={s}
                  role="option"
                  aria-selected={idx === activeIndex}
                  data-hover={idx === activeIndex}
                  onMouseDown={() => handleSelect(s)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ExcludeIngredients />

      <div className={styles.searchForm}>
        <p>Press Search for recipes with your ingredients</p>
        <SearchButton selectedIngredients={selectedIngredients} />
      </div>
    </>
  );
}




// SearchButton — validates selection, then calls fetchRecipes() from context.
// fetchRecipes() (defined in RecipeContext) calls Spoonacular, normalizes
// responses, deduplicates by name, and sets recipes/loading/error state.
function SearchButton({selectedIngredients}) {
  const { fetchRecipes, setIngredients } = useRecipeContext();

  async function handleClick() {
    // SCRUM-41: Read the raw input value and split by comma into an array.
    // parseIngredients (called inside fetchRecipes) handles trimming,
    // lowercasing, and deduplication downstream.

    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient");
      return;
    }

    setIngredients(selectedIngredients)
    await fetchRecipes(selectedIngredients);
  }

  return (
    <button onClick={handleClick} className={styles.searchBtn}>Search</button>
  );
}

export default SearchForm
