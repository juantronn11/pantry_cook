// SearchForm component — Owner: Christina Johnson
// Multi-select ingredient buttons + Search button
// Validates at least one ingredient is selected before submission

import styles from './SearchForm.module.css'

function SearchForm() {
  return (
    <div className={styles.searchForm}>
      <p>SearchForm placeholder</p>
    </div>
      <div className={styles.searchForm}>
        <p> Press Search for recipes with your ingredients</p>
        <SearchButton />
        <p>{SearchButton.result}</p>
      </div>

function SearchButton() {
  function handleClick() {
    result = fetch('/themealdb.com/api/json/v1/1/filter.php?i=' + 'chicken')
  }
  return (
    <button onClick={handleClick}>Search</button>
  )
}

export default SearchForm
