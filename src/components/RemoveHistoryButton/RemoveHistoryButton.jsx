// Remove History Button component - Owner: Christian Johnson
// Button to remove individual entries from the user's search history, rendered on the History page next to each entry

import styles from './RemoveHistoryButton.module.css'
import {useRecipeContext} from '../../context/RecipeContext';

function RemoveHistoryButton({timestamp}) { // timestamp is used to identify which entry to remove
    const { historyRecipes, setHistoryRecipes } = useRecipeContext();

    return (
        <button className = {styles.removeButton} onClick={() => {
            setHistoryRecipes(historyRecipes.filter(entry => entry.timestamp !== timestamp));
        }}>
            X
        </button>
    )
}

export default RemoveHistoryButton;