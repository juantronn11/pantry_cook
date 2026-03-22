// SearchForm component — Owner: Christina Johnson
// Multi-select ingredient buttons + Search button
// Validates at least one ingredient is selected before submission

import styles from './SearchForm.module.css'
import { useRecipeContext } from '../../context/RecipeContext';
import { ingredientAutocomplete } from '../../api/spoonacular';

import { useState } from 'react'
import { useEffect } from 'react';

var selectedIngredients;
const MAX_INGREDIENTS = 5;
const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

function SearchForm() {
  selectedIngredients = useRecipeContext().ingredients;

  return (
    <>
      <div className={styles.searchForm}>
        <label for = "ingredients">Select up to {MAX_INGREDIENTS} ingredients</label>

        <input
          type = 'text'
          id = "ingredients"
          name = 'name'
          onInput = {ingredientAutocomplete}
        />
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
  const { fetchRecipes } = useRecipeContext();

  async function handleClick() {
    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient");
      return;
    }

    await fetchRecipes(selectedIngredients);
  }

  return (
    <button onClick={handleClick}>Search</button>
  );
}

export default SearchForm
