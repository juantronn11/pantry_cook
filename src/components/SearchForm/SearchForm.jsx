// SearchForm component — Owner: Christina Johnson
// Multi-select ingredient buttons + Search button
// Validates at least one ingredient is selected before submission

import styles from './SearchForm.module.css'
import { useState } from 'react'
import { useEffect } from 'react';

var selectedIngredients = [];

function SearchForm() {
  var ingredients = setIngredientButtons();
  const [results, setResults] = useState(null);

  function SearchButton() {
    function handleClick() {
      fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken')
        .then(res => res.json())
        .then(data => setResults(data.meals));
    }
    return (
      <button onClick={handleClick}>Search</button>
    )
  }
  
  return (
    <>
      <div className={styles.ingredientButton}>
        {ingredients}
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
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
            .then(response => response.json())
            .then(data => setIngredientList(data.meals));
  }, []);

  if (!ingredientList) {
    return (<p>Loading...</p>)
  }
  else {
    for (var n = 0; n < ingredientList.length; n++) {
      ingredientButtons[n] = {name: ingredientList[n].strIngredient, id: n + 1, button: <Button text={ingredientList[n].strIngredient} key={n}/>}
    }
  }

  return ingredientButtons.map(button =>
    <div key={button.id}>{button.button}</div>
  )
}

function Button({ text }) {
 const [clicked, setClicked] = useState(false)

  function handleClick() {
    setClicked(!clicked)

    if (!clicked) {
      selectedIngredients = [...selectedIngredients, text];
    } else {
      selectedIngredients = selectedIngredients.filter(i => i !== text);
    }

    console.log(selectedIngredients);
  }
 
  return (
    <button onClick={handleClick} style={{color: !clicked ? 'white' : 'green'}}>{text}</button>
  )
}

export default SearchForm
