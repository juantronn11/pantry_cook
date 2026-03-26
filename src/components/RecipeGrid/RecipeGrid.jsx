// RecipeGrid component — Owner: Miguel Alvarez
// Responsive grid layout that displays RecipeTile components
// Handles the "no matching recipes" state

// RecipeTile validation - Owner: Christian Johnson
// Validate all values are present in each RecipeTile before displaying
// If no valid RecipeTiles, let user know

import styles from './RecipeGrid.module.css'
import { useRecipeContext } from '../../context/RecipeContext';
import RecipeTile from '../RecipeTile/RecipeTile';
import LoadingSpinner from "../RecipeGrid/loading.svg";
import { useEffect, useRef } from 'react';

function RecipeGrid({ recipes: recipesProp }) {
  const { recipes: contextRecipes, loading, ingredients, excludedIngredients } = useRecipeContext();
  const recipes = recipesProp ?? contextRecipes;
  const gridRef = useRef(null);

  useEffect(() => {
    if (!loading && gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loading]);

  if (recipes.length === 0 && !loading && ingredients.length > 0) {
    return (
      <div className={styles.emptyState}>
        <p>No recipes found. Try adding some ingredients to search!</p>
      </div>
    );
  }  
  return (
    <>
      {loading && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <img src={LoadingSpinner} alt="Loading..." width="150" height="150" />
          </div>
        </div>
      )}

      <div ref={gridRef} className={styles.recipeGrid}>
        {recipes.map((recipe) => (
          <RecipeTile key={recipe.id} recipe={recipe} />
        ))}
        {recipes.length == 0 && ingredients.length != 0 && !loading && alert("Unfortunately, we were unable to find any complete recipes for your response. Please try a different combination of ingredients")}
      </div>
    </>
  );
}

export default RecipeGrid;

