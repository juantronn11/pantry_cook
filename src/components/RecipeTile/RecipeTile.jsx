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
import { useAuth0 } from "@auth0/auth0-react";
//SCRUM 77: added stylized error images for thumbnail and in-tile images.
import errorThumb from '../../../media/error_thumbnail.jpg';
import errorImage from '../../../media/error_image.jpg';
import ShoppingListButton from '../ShoppingListButton/ShoppingListButton';
import { scaleIngredients } from '../../utils/scaleIngredients';

function RecipeTile({recipe}) {
  const { saveRecipe, removeSavedRecipe, isRecipeSaved } = useRecipeContext();
  const saved = isRecipeSaved(recipe.id);
  const {isAuthenticated} = useAuth0();
  

  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [saveError, setSaveError] = useState(null);
  // SCRUM-164: Track the current serving size the user has selected in the modal.
  // Initialized to the recipe's original servings when the modal opens.
  // Used to scale ingredient amounts in the display and when sending to the shopping list.
  const [servings, setServings] = useState(recipe.raw?.servings || 1);
  // SCRUM-79/80/86: Validation previously lived here (ValidationCheck) but
  // called setRecipes() during render, causing an infinite re-render loop.
  // Validation is now handled in RecipeContext.fetchRecipes() before recipes
  // reach the grid. See SCRUM-110.

  // SCRUM-71: Transform Spoonacular's recipe format into the modal's expected shape.
  function toModalFormat(raw) {
    const formatted = {
      strMeal: raw.title,
      strMealThumb: raw.image,
      strCategory: raw.dishTypes?.join(', ') || 'N/A',
      strArea: raw.cuisines?.join(', ') || 'N/A',
      strInstructions: raw.instructions,
      strYoutube: null,
      strCookTime: raw.readyInMinutes || 'N/A',
    };

    // Map extendedIngredients to strIngredient1/strMeasure1, strIngredient2/strMeasure2, ... format
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
      setModalData(toModalFormat(recipe.raw));
    } catch {
      setError(true);
    }
  }

  const closeModal = () => {
    setModalData(null);
    setError(false);
    setSaveError(null);
    setServings(recipe.raw?.servings || 1);
  };

  const handleSaveToggle = async () => {
    setSaveError(null);
    try {
      if (saved) {
        await removeSavedRecipe(recipe.id);
      } else {
        await saveRecipe(recipe);
      }
    } catch {
      setSaveError('Failed to save. Check your network connection or try logging out and back in.');
    }
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
        <p>{recipe.raw.title}</p>
        <img
          src={imageError ? errorThumb : recipe.raw.image}
          onClick={clickHandler}
          style={{ cursor: 'pointer' }}
          alt={imageError ? 'Error' : recipe.raw.title}
          onError={handleImageError}
        />
        
      </div>

      {(modalData || error) && (() => {
        const scaledIngredients = scaleIngredients(
          recipe.raw?.extendedIngredients || [],
          servings / (recipe.raw?.servings || 1)
        );
        const scaledRecipe = {
          ...recipe,
          raw: { ...recipe.raw, extendedIngredients: scaledIngredients },
        };
        return (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>X</button>
            {error ? (
              <p>Unable to get recipe</p>
            ) : (
              <>
                  <DownloadButton></DownloadButton>
                  {isAuthenticated && <button
                    onClick={handleSaveToggle}
                    className={styles.saveBtn}
                  >
                    {saved ? 'Remove from Library' : 'Save to Library'}
                  </button>}
                  {isAuthenticated && <ShoppingListButton recipe={scaledRecipe} /> }
                  <img src={imageError ? errorImage : modalData.strMealThumb} alt={imageError ? 'Error' : modalData.strMeal} className={styles.modalImg} onError={handleImageError} />
                  <h2 className={styles.recipeTitle}>{modalData.strMeal}</h2>
                  <p className={styles.other}><strong>Category:</strong> {modalData.strCategory}</p>
                  <p className={styles.other}><strong>Area:</strong> {modalData.strArea}</p>
                  <p className={styles.other}><strong>Cook Time:</strong> {modalData.strCookTime} minutes</p>
                  <div className={styles.servingsControl}>
                    <strong>Servings:</strong>
                    {isAuthenticated && (
                      <button
                        onClick={() => setServings(s => Math.max(1, s - 1))}
                        disabled={servings <= 1}
                        className={styles.servingsBtn}
                        aria-label="Decrease servings"
                      >
                        -
                      </button>
                    )}
                    <span className={styles.servingsCount}>{servings}</span>
                    {isAuthenticated && (
                      <>
                        <button
                          onClick={() => setServings(s => s + 1)}
                          className={styles.servingsBtn}
                          aria-label="Increase servings"
                        >
                          +
                        </button>
                        <button
                          onClick={() => setServings(recipe.raw?.servings || 1)}
                          disabled={servings === (recipe.raw?.servings || 1)}
                          className={styles.servingsResetBtn}
                          aria-label="Reset servings to original"
                          title="Reset to original servings"
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </div>
                  <p><strong>Ingredients:</strong></p>
                  <ul className={styles.ingredientsList}>
                    {modalData.strInstructions && scaledIngredients.map((ing, index) => (
                      <li key={index}>
                        {ing.name || ing.original}
                        {ing.amount > 0 && ` - ${Number(ing.amount.toFixed(2))} ${ing.unit || ''}`.trimEnd()}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Instructions:</strong></p>
                  <p className={styles.recipeInstructions}>{modalData.strInstructions}</p>
                  {modalData.strYoutube && (
                    <a className={styles.other} href={modalData.strYoutube} target="_blank" rel="noreferrer">▶ Watch on YouTube</a>
                  )}
              </>
            )}
          </div>
        </div>
        );
      })()}
    </>

  )
}

export default RecipeTile
