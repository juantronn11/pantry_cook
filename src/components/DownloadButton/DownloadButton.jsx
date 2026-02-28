// DownloadButton component — Owner: Tina Carter
// PDF download and print functionality for individual recipes
// Renders on each RecipeTile

import styles from './DownloadButton.module.css'

function DownloadButton() {
  return (
    <button className={styles.downloadButton} onClick={() => {
      // This button only renders inside the modal when recipe data loaded
      // successfully, so we can safely open the print dialog directly.
      window.print();
    }}>
      Download / Print
    </button>
  )
}

export default DownloadButton
