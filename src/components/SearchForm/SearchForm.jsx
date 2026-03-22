// SearchForm component — Owner: Christina Johnson
// Multi-select ingredient buttons + Search button
// Validates at least one ingredient is selected before submission

import styles from './SearchForm.module.css'
import { useRecipeContext } from '../../context/RecipeContext';

import { useState } from 'react'
import { useEffect } from 'react';

var selectedIngredients;
const MAX_INGREDIENTS = 5;
const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

function SearchForm() {
  var ingredientsList = setIngredientButtons();
  selectedIngredients = useRecipeContext().ingredients;

  return (
    <>
      <div className={styles.searchForm}>
        <label for = "ingredients">Select up to {MAX_INGREDIENTS} ingredients</label>

        <input
          type = 'text'
          id = "ingredients"
          name = 'name'
        />
      </div>
      
      <div className={styles.searchForm}>
        <p> Press Search for recipes with your ingredients</p>
        <SearchButton />
      </div>  
    </>
  )
}

function setIngredientButtons() {
  const [ingredientList, setIngredientList] = useState(null);
  var ingredientButtons = [];
  useEffect(() => {
    fetch(API_URL + 'list.php?i=list')
      .then(response => response.json())
      .then(data => setIngredientList(data.meals));
  }, []);

  if (!ingredientList) {
    return (<p>Loading...</p>)
  }
  else {
    ingredientList.sort((a, b) => a.strIngredient.localeCompare(b.strIngredient));
    for (var n = 0; n < ingredientList.length; n++) {
      ingredientButtons[n] = {name: ingredientList[n].strIngredient, id: n + 1, button: <Button text={ingredientList[n].strIngredient} key={n}/>}
    }
  }

  return ingredientButtons.map(button =>
    <div key={button.id}>{button.button}</div>
  )
}

function Button({ text }) {
 const [clicked, setClicked] = useState(false);
 const { ingredients, setIngredients } = useRecipeContext();

  function handleClick() {
    setClicked(!clicked)
    
    if (!clicked) {
      selectedIngredients = [...selectedIngredients, text];
    } else {
      selectedIngredients = selectedIngredients.filter(i => i !== text);
    }

    if (selectedIngredients.length > MAX_INGREDIENTS){
      alert("Please refrain from selecting more than " + MAX_INGREDIENTS + " ingredients at a time.");
      selectedIngredients = selectedIngredients.filter(i => i !== text);
      setClicked(false);
    }

    setIngredients(selectedIngredients);
  }
 
  return (
    <button onClick={handleClick} style={{color: !ingredients.includes(text) ? 'white' : 'lime', backgroundColor: 'grey', fontSize: 'large'}}>{text}</button>
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
