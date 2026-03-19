// RecipeTile component — Owner: Miguel Alvarez
// Individual recipe card with name, thumbnail, summary, and link
// Includes DownloadButton for PDF/print functionality

// RecipeTile additional error handling — Owner: Tina Carter
// Image error handling information:
// https://medium.com/@hridoymahmud/solving-image-loading-and-error-handling-issues-in-react-with-a-custom-image-component-b6c5d0184f96
// see line 106: 
// 106 | | | | | |  <img src={modalData.strMealThumb} alt={modalData.strMeal} className={styles.modalImg} />

import styles from './RecipeTile.module.css';
import {useState} from 'react'
import DownloadButton from '../DownloadButton/DownloadButton';
import { useRecipeContext } from '../../context/RecipeContext';

function RecipeTile({recipe}) {
  const { saveRecipe, removeSavedRecipe, isRecipeSaved } = useRecipeContext();
  const saved = isRecipeSaved(recipe.id);

  const API_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);

  // SCRUM-71: Transform Spoonacular's recipe format into MealDB's format
  // so the modal rendering code works the same for both API sources.
  function spoonacularToMealDBFormat(raw) {
    const formatted = {
      strMeal: raw.title,
      strMealThumb: raw.image,
      strCategory: raw.dishTypes?.join(', ') || 'N/A',
      strArea: raw.cuisines?.join(', ') || 'N/A',
      strInstructions: raw.instructions,
      strYoutube: null,
    };

    // Map Spoonacular's extendedIngredients array to MealDB's
    // strIngredient1/strMeasure1, strIngredient2/strMeasure2, ... format
    raw.extendedIngredients?.forEach((ing, i) => {
      formatted[`strIngredient${i + 1}`] = ing.name || ing.original;
      formatted[`strMeasure${i + 1}`] = ing.amount
        ? `${ing.amount} ${ing.unit || ''}`.trim()
        : '';
    });

    return formatted;
  }

  // SCRUM-71: Check recipe.source to use the correct API.
  // MealDB recipes need a lookup call; Spoonacular recipes already have
  // full details in recipe.raw so we just transform and display them.
  const clickHandler = async () => {
    setLoading(true);
    setError(false);

    try {
      if (recipe.source === 'spoonacular') {
        // Spoonacular: full details already in recipe.raw — no API call needed
        setModalData(spoonacularToMealDBFormat(recipe.raw));
      } else {
        // MealDB: fetch full details from lookup endpoint
        const res = await fetch(API_URL + recipe.raw.idMeal);
        const data = await res.json();

        if (data.meals == "Invalid ID") throw new Error();

        setModalData(data.meals[0]);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const closeModal = () => {
    setModalData(null)
    setError(false);
  };

  //SCRUM-74: Error handling for missing/invalid images. If the image fails to load, hide default broken image icon.
  const handleImageError = () => {
    setImageError(true);
  };
  

  return (

    <>
      <div className={styles.recipeTile}>
        <p>{recipe.raw.strMeal || recipe.raw.title}</p>
        {/* SCRUM-71: Show which API the recipe came from */}
        <small style={{ color: recipe.source === 'spoonacular' ? 'orange' : 'green', fontWeight: 'bold' }}>
          [{recipe.source}]
        </small>
        <img
          src={recipe.raw.strMealThumb || recipe.raw.image}
          onClick={clickHandler}
          style={{ cursor: 'pointer' }}
          alt={recipe.raw.strMeal || recipe.raw.title}
        />
        {loading && <p> Loading... </p>}
      </div>

      {(modalData || error) && (

        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>X</button>
            {error ? (
              <p>Unable to get recipe</p>
            ) : (
              <>
                  <DownloadButton></DownloadButton>
                  <button
                    onClick={() => saved ? removeSavedRecipe(recipe.id) : saveRecipe(recipe)}
                    className={styles.saveBtn}
                  >
                    {saved ? 'Remove from Library' : 'Save to Library'}
                  </button>
                  <img src={imageError ? '../../../media/chicken_alfredo.jpg' : modalData.strMealThumb} alt={imageError ? 'Error' : modalData.strMeal} className={imageError ? styles.error : styles.modalImg} onError={handleImageError} />
                  <h2 className={styles.recipeTitle}>{modalData.strMeal}</h2>
                  <p className={styles.other}><strong>Category:</strong> {modalData.strCategory}</p>
                  <p className={styles.other}><strong>Area:</strong> {modalData.strArea}</p>
                  <p><strong>Ingredients:</strong></p>
                  <ul className={styles.ingredientsList}> {modalData.strInstructions && Object.keys(modalData).filter(key => key.startsWith('strIngredient') && modalData[key]).map((key, index) => (
                    <li key={index}>{modalData[key]} - {modalData[`strMeasure${key.slice(13)}`]}</li>
                  ))} </ul>
                  <p><strong>Instructions:</strong></p>
                  <p className={styles.recipeInstructions}>{modalData.strInstructions}</p>
                  {modalData.strYoutube && (
                    <a className={styles.other} href={modalData.strYoutube} target="_blank" rel="noreferrer">▶ Watch on YouTube</a>
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </>

  )
}

export default RecipeTile
