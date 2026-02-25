// RecipeTile component — Owner: Miguel Alvarez
// Individual recipe card with name, thumbnail, summary, and link
// Includes DownloadButton for PDF/print functionality

import styles from './RecipeTile.module.css';

function RecipeTile({recipe}) {
  //grabbing the full recipe in case we want to do more than just list the recipes
  const API_URL = 'www.themealdb.com/api/json/v1/1/lookup.php?i=';
  const clickHandler = () => {
    fetch(API_URL+ recipe.idMeal)
    .then(res => res.json)
    .then(data => console.log(data))
    };

  return (
    <div className={styles.recipeTile}>
      <p>{recipe.strmeal}</p>
      <img src={recipe.strMealThumb } onclick = {clickHandler} />
      <p>{recipe.idMeal}</p>
    </div>
  )
}
export default RecipeTile
