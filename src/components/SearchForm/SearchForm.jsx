// SearchForm component — Owner: Christina Johnson
// Multi-select ingredient buttons + Search button
// Validates at least one ingredient is selected before submission

import styles from './SearchForm.module.css'
import { useRecipeContext } from '../../context/RecipeContext';
import { ingredientAutocomplete } from '../../api/spoonacular';
import ExcludeIngredients from '../ExcludeIngredients/ExcludeIngredients';

import { useState, useEffect, useRef, useCallback } from 'react'

var selectedIngredients;
const MAX_INGREDIENTS = 5;
const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

function SearchForm() {
  selectedIngredients = useRecipeContext().ingredients;
  const debounceTimer = useRef(null);
  const autocompletedIngredients = useRef(new Set());

  // SCRUM-116: Debounce autocomplete so the API is only called after the user
  // stops typing for 500ms. Tracks which ingredients have already been
  // autocompleted so each one only triggers one API call. Supports up to
  // MAX_INGREDIENTS comma-separated entries.
  const handleInput = useCallback((e) => {
    const raw = e.target.value;
    const parts = raw.split(',').map(p => p.trim()).filter(p => p !== '');
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      for (const ingredient of parts) {
        if (ingredient.length >= 2 && !autocompletedIngredients.current.has(ingredient.toLowerCase())) {
          autocompletedIngredients.current.add(ingredient.toLowerCase());
          ingredientAutocomplete(ingredient);
        }
      }
    }, 500);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  return (
    <>
      <div className={styles.searchForm}>
        <label for = "ingredients">Select up to {MAX_INGREDIENTS} ingredients</label>

        <input
          type = 'text'
          id = "ingredients"
          name = 'name'
          onInput = {handleInput}
        />
      </div>
      
      {/* SCRUM-106: Exclude ingredients sits between the ingredient input
          and the Search button so it feels part of the search experience */}
      <div className={styles.searchForm}>
        <ExcludeIngredients />
      </div>

      <div className={styles.searchForm}>
        <p> Press Search for recipes with your ingredients</p>
        <SearchButton />
      </div>
    </>
  )
}




// SearchButton — validates selection, then calls fetchRecipes() from context.
// fetchRecipes() (defined in RecipeContext) fires both MealDB and Spoonacular
// concurrently, normalizes responses, deduplicates by name, and sets
// recipes/loading/error state automatically.
function SearchButton() {
  const { fetchRecipes, setIngredients } = useRecipeContext();

  async function handleClick() {
    // SCRUM-41: Read the raw input value and split by comma into an array.
    // parseIngredients (called inside fetchRecipes) handles trimming,
    // lowercasing, and deduplication downstream.
    const input = document.getElementById('ingredients')
    const raw = input?.value?.split(',') ?? []
    const ingredients = raw.map(i => i.trim()).filter(i => i !== '')

    if (ingredients.length === 0) {
      alert("Please select at least one ingredient");
      return;
    }

    setIngredients(ingredients)
    await fetchRecipes(ingredients);
  }

  return (
    <button onClick={handleClick}>Search</button>
  );
}

export default SearchForm
