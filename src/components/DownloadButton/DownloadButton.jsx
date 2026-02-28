// DownloadButton component — Owner: Tina Carter
// PDF download and print functionality for individual recipes
// Renders on each RecipeTile

import styles from './DownloadButton.module.css'
import RecipeTile from '../RecipeTile/RecipeTile.jsx';

function DownloadButton() {
  return (
    <button className={styles.downloadButton} onClick={() => {
      if(RecipeTile.returnsNull) {
        // If the recipe is not initialized, show an alert instead of trying to print
        window.alert('This page is not a recipe ready for print. Please ensure you are on a recipe page before trying to download or print.');

      }
      else {
        // Open the print dialog for the current page
        window.print();
      }
    }}>
      Download / Print
    </button>
  )
}

export default DownloadButton
