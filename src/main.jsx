// main.jsx — Application entry point
//
// This file renders the app into the DOM and wraps it in providers:
//   - StrictMode: React development helper that warns about potential issues
//   - BrowserRouter: Enables client-side routing (React Router)
//   - RecipeProvider: Provides shared state (ingredients, recipes, loading, error)
//     to all components in the app

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RecipeProvider } from './context/RecipeContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RecipeProvider>
        <App />
      </RecipeProvider>
    </BrowserRouter>
  </StrictMode>,
)
