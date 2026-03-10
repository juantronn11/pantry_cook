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
import Navbar from './components/Navbar/Navbar'
import SearchPage from './pages/SearchPage'
import HistoryPage from './pages/HistoryPage'
import SavedPage from './pages/SavedPage'
import ResultsPage from './pages/ResultsPage'
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const {
    isLoading, // Loading state, the SDK needs to reach Auth0 on load
    isAuthenticated,
    error,
    loginWithRedirect: login, // Starts the login flow
    logout: auth0Logout, // Starts the logout flow
    user, // User profile
  } = useAuth0();

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return "Loading..."; // swap with a better loading element
  //  const { setUser } = useUserContext();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/results" element={<ResultsPage/>}/>
      </Routes>
        {isAuthenticated ? (
        <>
          <p>Logged in as {user.email}</p>

          <h1>User Profile</h1>

          <pre>{JSON.stringify(user, null, 2)}</pre>

          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          {error && <p>Error: {error.message}</p>}

          <button onClick={signup}>Signup</button>

          <button onClick={login}>Login</button>
        </>
      )}
    </>
  )
}

export default App
