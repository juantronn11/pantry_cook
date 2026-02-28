// DownloadButton component — Owner: Tina Carter
// PDF download and print functionality for individual recipes
// Renders on each RecipeTile

import styles from './DownloadButton.module.css'

function DownloadButton() {
  return (
    <button className={styles.downloadButton} onClick={() => {
      if(document.body.classList.contains('recipeTitle') && 
      document.body.classList.contains('ingredientsList') && 
      document.body.classList.contains('recipeInstructions')) {
        // Open the print dialog for the current page
        window.print();
      }
      else {
        // If the required elements are not present, show an alert
        window.alert('This Recipe is missing some or all of its information and cannot be downloaded or printed.');
      }
      window.alert('This Recipe is missing some or all of its information and cannot be printed.');
    }}>
      Download / Print
    </button>
  )
}

export default DownloadButton
