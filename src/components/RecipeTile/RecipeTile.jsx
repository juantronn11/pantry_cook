// RecipeTile component — Owner: Miguel Alvarez
// Individual recipe card with name, thumbnail, summary, and link
// Includes DownloadButton for PDF/print functionality

import styles from './RecipeTile.module.css';
import {useState} from 'react'
import DownloadButton from '../DownloadButton/DownloadButton';

function RecipeTile({recipe}) {

  const API_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const clickHandler = async (id) => {
    setLoading(true);
    setError(false);

    try{
      
      const res = await fetch(API_URL + id);
      const data = await res.json();
      console.log(data.meals);
      if(data.meals == "Invalid ID") throw new Error();
      setModalData(data.meals[0]);
      setLoading(false);

    } catch{

      setError(true);

    } finally{

      setLoading(false);

    }
  }

  const closeModal = () => {
    setModalData(null)
    setError(false);
  };

  return (

    <>
      <div className={styles.recipeTile}>
        <p>{recipe.strMeal}</p>
        <img
          src={recipe.strMealThumb}
          onClick={() => clickHandler(recipe.idMeal)}
          style={{ cursor: 'pointer' }}
          alt={recipe.strMeal}
        />
        {loading && <p>Loading...</p>}
      </div>

      {(modalData || error) && (

        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>X</button>
            {error ? (
              <p>Unable to get recipe</p>
            ) : (
              <>
                  <DownloadButton></DownloadButton>
                  <img src={modalData.strMealThumb} alt={modalData.strMeal} className={styles.modalImg} />
                  <h2>{modalData.strMeal}</h2>
                  <p><strong>Category:</strong> {modalData.strCategory}</p>
                  <p><strong>Area:</strong> {modalData.strArea}</p>
                  <p><strong>Instructions:</strong></p>
                  <p className={styles.instructions}>{modalData.strInstructions}</p>
                  {modalData.strYoutube && (
                    <a href={modalData.strYoutube} target="_blank" rel="noreferrer">▶ Watch on YouTube</a>
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </>

  )
}

export default RecipeTile
