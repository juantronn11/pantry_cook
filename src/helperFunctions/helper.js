import { useAuth0 } from '@auth0/auth0-react';
import { logError } from './logError'

const url = "/";

// helper to handle responses consistently
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error: ${response.status}`);
  }
  return response.json();
}

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  async function authHeaders() {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }
    });
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async function createUser() {
    try {
      const response = await fetch( url + "user", {
        method: "POST",
        headers: await authHeaders()
      });
      if (response.status === 409) return null; // user already exists, that's fine
      return await handleResponse(response);
    } catch (e) {
      logError(e.message, 'helper:createUser')
      throw e;
    }
  }

  async function getSavedRecipes() {
    try {
      const response = await fetch(url + "user", {
        method: "GET",
        headers: await authHeaders()
      });
      const data = await handleResponse(response);
      return data?.recipes ?? [];
    } catch (e) {
      logError(e.message, 'helper:getSavedRecipes')
      throw e;
    }
  }

  async function updateRecipes(recipe) {
    try {
      const response = await fetch(url + "recipe", {
        method: "PUT",
        body: JSON.stringify({ recipe }),
        headers: await authHeaders()
      });
      return await handleResponse(response);
    } catch (e) {
      logError(e.message, 'helper:updateRecipes')
      throw e;
    }
  }

  async function deleteRecipe(recipeId) {
    try {
      const response = await fetch(url + "recipe", {
        method: "DELETE",
        body: JSON.stringify({ recipeId }),
        headers: await authHeaders()
      });
      return await handleResponse(response);
    } catch (e) {
      logError(e.message, 'helper:deleteRecipe')
      throw e;
    }
  }

  return { createUser, getSavedRecipes, updateRecipes, deleteRecipe };
}