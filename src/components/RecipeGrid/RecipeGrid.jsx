// RecipeGrid component — Owner: Miguel Alvarez
// Responsive grid layout that displays RecipeTile components
// Handles the "no matching recipes" state

import styles from './RecipeGrid.module.css'
import { useRecipeContext } from '../../context/RecipeContext';
import RecipeTile from '../RecipeTile/RecipeTile';

function RecipeGrid() {

  const { recipes } = useRecipeContext();

  return (
    <div className={styles.recipeGrid}>
      {recipes.map((recipe) => (
        <RecipeTile key={recipe.idMeal} recipe={recipe} />
      ))}
    </div>
  )
}

export default RecipeGrid
