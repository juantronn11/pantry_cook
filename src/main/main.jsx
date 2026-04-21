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
import { RecipeProvider } from '../context/RecipeContext.jsx'
import { ThemeProvider } from '../context/ThemeContext.jsx'
import App from '../app/App.jsx'
import './index.css'
import { Auth0Provider } from "@auth0/auth0-react";
import { logError } from '../helperFunctions/logError.js'

window.onerror = (_message, _source, _lineno, _colno, error) => {
  logError(error?.message || String(_message), 'window.onerror')
}

window.onunhandledrejection = (event) => {
  logError(event.reason?.message || String(event.reason), 'window.onunhandledrejection')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Auth0Provider
            domain={import.meta.env.VITE_DOMAIN}
            clientId={import.meta.env.VITE_CLIENT_ID}
            authorizationParams={{ redirect_uri: window.location.origin }}
            >
                <ThemeProvider>
                  <RecipeProvider>

                  <App />

                </RecipeProvider>
                </ThemeProvider>
          </Auth0Provider>
      </BrowserRouter>

  </StrictMode>,
)
