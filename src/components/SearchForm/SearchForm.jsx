// SearchForm component — Owner: Christina Johnson
// Multi-select ingredient buttons + Search button
// Validates at least one ingredient is selected before submission

import styles from './SearchForm.module.css'

function SearchForm() {
  var results;  
  return (
    <>
      <div className={styles.searchForm}>
        <p>SearchForm placeholder</p>
      </div>
      <div className={styles.searchForm}>
        <p> Press Search for recipes with your ingredients</p>
        <SearchButton />
      </div>  
    </>
  )
}

function SearchButton() {
  var results;
  
  function handleClick() {
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken')
      .then(res => res.json())
      .then(data => SearchForm.results = data.meals);
  }
  return (
    <button onClick={handleClick}>Search</button>
  )
}

export default SearchForm
