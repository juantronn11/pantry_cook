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
        <p>Select up to {MAX_INGREDIENTS} ingredients</p>
      </div>

      <div className={styles.ingredientButton}>
        {ingredientsList}
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
    <button onClick={handleClick} style={{color: !clicked ? 'white' : 'lime', backgroundColor: 'grey'}}>{text}</button>
  )
}


  function SearchButton() {
    var recipeReturn = [];
    const {recipes, setRecipes} = useRecipeContext();
    
    function handleClick() {
      recipeReturn = [];

      const getRecipes = async() => {
        if (selectedIngredients.length > 0) {
          for (var i = 0; i < selectedIngredients.length; i++) {
            fetch(API_URL + 'filter.php?i=' + selectedIngredients[i])
              .then(res => res.json())
              .then(data => data.meals != null && recipeReturn.push(data.meals))
          }
        }
        else {
          alert("Please select at least one ingredient")
        }

        await setRecipes(recipeReturn)
      }

      try {
        getRecipes()

        if (recipes.length == 0){
          throw new Error("Error: No value returned to recipes")
        }
        else {
          for (var i=0; i < recipes.length; i++) {
            if (recipes[i] == null) {
              throw new Error("Error: Null value returned to recipes")
            }
          }
        }
      } catch (e) {
        console.error(e.message)
      }
    }
    
    return (
      <button onClick={handleClick}>Search</button>      
    )
  }

export default SearchForm
