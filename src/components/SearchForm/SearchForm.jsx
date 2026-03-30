// SearchForm component — Owner: Christina Johnson
// Multi-select ingredient buttons + Search button
// Validates at least one ingredient is selected before submission

import { useState } from 'react';
import styles from './SearchForm.module.css';
import { useRecipeContext } from '../../context/RecipeContext';
import { ingredientAutocomplete } from '../../utils/ingredientTrie';

const MAX_INGREDIENTS = 5;

function SearchForm() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  function handleInput(e) {
    const value = e.target.value;
    setQuery(value);
    setSuggestions(value.trim() ? ingredientAutocomplete(value) : []);
  }

  function handleSelect(ingredient) {
    if (selectedIngredients.length >= MAX_INGREDIENTS) return;
    if (selectedIngredients.includes(ingredient)) return;
    setSelectedIngredients(prev => [...prev, ingredient]);
    setQuery('');
    setSuggestions([]);
  }

  function handleRemove(ingredient) {
    setSelectedIngredients(prev => prev.filter(i => i !== ingredient));
  }

  return (
    <>
      <div className={styles.searchForm}>
        <label htmlFor="ingredients">
          Select up to {MAX_INGREDIENTS} ingredients
        </label>

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
            disabled={selectedIngredients.length >= MAX_INGREDIENTS}
            placeholder="Type an ingredient..."
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
      </div>

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
    <button onClick={handleClick}>Search</button>
  );
}

export default SearchForm
