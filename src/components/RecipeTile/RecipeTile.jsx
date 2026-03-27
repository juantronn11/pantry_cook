// RecipeTile component — Owner: Miguel Alvarez
// Individual recipe card with name, thumbnail, summary, and link
// Includes DownloadButton for PDF/print functionality

// RecipeTile additional error handling — Owner: Tina Carter
// Image error handling information:
// https://medium.com/@hridoymahmud/solving-image-loading-and-error-handling-issues-in-react-with-a-custom-image-component-b6c5d0184f96

// RecipeTile element validation - Owner: Christian Johnso
// If any necessary values are not present or corrupted, recipe tile will not be displayed

import styles from './RecipeTile.module.css';
import {useState} from 'react'
import DownloadButton from '../DownloadButton/DownloadButton';
import { useRecipeContext } from '../../context/RecipeContext';
//SCRUM 77: added stylized error images for thumbnail and in-tile images.
import errorThumb from '../../../media/error_thumbnail.jpg';
import errorImage from '../../../media/error_image.jpg';

function RecipeTile({recipe}) {
  const { saveRecipe, removeSavedRecipe, isRecipeSaved } = useRecipeContext();
  const saved = isRecipeSaved(recipe.id);

  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  // SCRUM-79/80/86: Validation previously lived here (ValidationCheck) but
  // called setRecipes() during render, causing an infinite re-render loop.
  // Validation is now handled in RecipeContext.fetchRecipes() before recipes
  // reach the grid. See SCRUM-110.

  // SCRUM-71: Transform Spoonacular's recipe format into the modal's expected shape.
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

  // Full details already in recipe.raw — no API call needed
  const clickHandler = async () => {
    setLoading(true);
    setError(false);

    try {
      setModalData(spoonacularToMealDBFormat(recipe.raw));
    } catch {
      setError(true);
    }
  }

  const closeModal = () => {
    setModalData(null)
    setError(false);
  };

  //SCRUM-74: Error handling for missing/invalid images. If the image fails to load, hide default broken image icon.
  //SCRUP-75: Error handling for missing/invalid images. (overwrites SCRUM-74) If the image fails to load, replace it with an error image but maintain the original image's dimensions.
  const handleImageError = (e) => {
    const width = e.currentTarget.style.width;
    const height = e.currentTarget.style.height;
    e.currentTarget.src = errorImage; // Set to custom error image
    e.currentTarget.style.width = width; // Maintain original dimensions
    e.currentTarget.style.height = height; 
    setImageError(true); // Update state to indicate an image error occurred
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
          src={imageError ? errorThumb : recipe.raw.strMealThumb || recipe.raw.image}
          onClick={clickHandler}
          style={{ cursor: 'pointer' }}
          alt={imageError ? 'Error' :recipe.raw.strMeal || recipe.raw.title}
          onError={handleImageError}
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
                  <img src={imageError ? errorImage : modalData.strMealThumb} alt={imageError ? 'Error' : modalData.strMeal} className={styles.modalImg} onError={handleImageError} />
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
