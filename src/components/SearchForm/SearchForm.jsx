// SearchForm component — Owner: Christina Johnson
// Multi-select ingredient buttons + Search button
// Validates at least one ingredient is selected before submission

import styles from './SearchForm.module.css'
import { useRecipeContext } from '../../context/RecipeContext';
import { ingredientAutocomplete } from '../../api/spoonacular';
import ExcludeIngredients from '../ExcludeIngredients/ExcludeIngredients';

import { useState } from 'react'
import { useEffect } from 'react';

var selectedIngredients;
const MAX_INGREDIENTS = 5;

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
// fetchRecipes() (defined in RecipeContext) calls Spoonacular, normalizes
// responses, deduplicates by name, and sets recipes/loading/error state.
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
