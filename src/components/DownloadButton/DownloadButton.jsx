// DownloadButton component — Owner: Tina Carter
// PDF download and print functionality for individual recipes
// Renders on each RecipeTile

import styles from './DownloadButton.module.css'

function DownloadButton() {
  return (
    <button className={styles.downloadButton} onClick={() => print()}>
      Download / Print
    </button>
  )
}

export default DownloadButton
