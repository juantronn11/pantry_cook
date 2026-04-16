// Clear History Button component - Owner: Christian Johnson
// Button to clear the user's search history, rendered on the History page

import styles from './ClearHistoryButton.module.css'
import {useRecipeContext} from '../../context/RecipeContext';

function ClearHistoryButton() {
    const { setHistoryRecipes } = useRecipeContext();

    return (
        <button className = {styles.ClearHistoryButton} onClick={() => {
            // Clear the user's search history
            if (confirm('Are you sure you want to clear your search history? This action cannot be undone.')) {
                setHistoryRecipes([]);
            }
        }}>
            Clear History
        </button>
    )
}

export default ClearHistoryButton;