// App.jsx — Root layout component
//
// This file defines the top-level structure of the app:
//   1. The Navbar is rendered at the top of every page
//   2. React Router's <Routes> swaps the page content below the Navbar
//      based on the current URL:
//        /         → SearchPage  (main ingredient search + recipe results)
//        /history  → HistoryPage (future feature — recipe search history)
//        /saved    → SavedPage   (future feature — saved recipe collection)

import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import SearchPage from '../pages/SearchPage'
import HistoryPage from '../pages/HistoryPage'
import SavedPage from '../pages/SavedPage'
import ShoppingListPage from '../pages/ShoppingListPage'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchPage/>} />
        <Route path="/history" element={<HistoryPage/>} />
        <Route path="/saved" element={<SavedPage/>} />
        <Route path="/shopping-list" element={<ShoppingListPage/>} />
      </Routes>
    </>
  )
}

export default App
