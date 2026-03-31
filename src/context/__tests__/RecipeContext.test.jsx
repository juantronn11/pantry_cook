// Unit tests for RecipeContext (src/context/RecipeContext.jsx)
//
// These tests verify the fetchRecipes function which:
//   1. Calls Spoonacular API and normalizes responses to { id, name, source, raw } shape
//   2. Deduplicates results by name
//   3. Manages loading/error state
//   4. SCRUM-119: Skips API call when same ingredients re-searched with only added exclusions
//
// The API module is mocked so we test only the context logic.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useState } from 'react'
import { RecipeProvider, useRecipeContext } from '../RecipeContext'

// Mock Spoonacular API module — we don't want real fetch calls here.
// We're testing the context's normalization/dedup logic, not the API.
vi.mock('../../api/spoonacular', () => ({
  fetchSpoonacularRecipes: vi.fn(),
}))

// Import the mocked function so we can control its return values
import { fetchSpoonacularRecipes } from '../../api/spoonacular'

beforeEach(() => {
  vi.clearAllMocks()
})

// Helper component that exposes context values to the test
// Renders the current state as text so we can query it with screen.getByTestId
function TestConsumer() {
  const { recipes, loading, error, fetchRecipes } = useRecipeContext()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="error">{error || 'none'}</span>
      <span data-testid="count">{recipes.length}</span>
      <span data-testid="recipes">{JSON.stringify(recipes)}</span>
      <button onClick={() => fetchRecipes(['chicken'])}>Fetch</button>
    </div>
  )
}

// Helper: renders TestConsumer wrapped in RecipeProvider
function renderWithProvider() {
  return render(
    <RecipeProvider>
      <TestConsumer />
    </RecipeProvider>
  )
}

describe('RecipeContext — fetchRecipes', () => {

  it('normalizes Spoonacular results to { id, name, source, raw } shape', async () => {
    fetchSpoonacularRecipes.mockResolvedValue([
      { id: 200, title: 'Tomato Soup', image: 'img.jpg' },
    ])

    renderWithProvider()
    await act(async () => screen.getByText('Fetch').click())

    const recipes = JSON.parse(screen.getByTestId('recipes').textContent)
    expect(recipes).toHaveLength(1)
    expect(recipes[0].id).toBe('spoonacular-200')
    expect(recipes[0].name).toBe('tomato soup')
    expect(recipes[0].source).toBe('spoonacular')
    expect(recipes[0].raw.title).toBe('Tomato Soup')
  })

  it('deduplicates results by name', async () => {
    // Same recipe name appearing twice (e.g. from multiple ingredient sub-searches)
    fetchSpoonacularRecipes.mockResolvedValue([
      { id: 200, title: 'Chicken Curry', image: 'img.jpg' },
      { id: 201, title: 'Chicken Curry', image: 'img2.jpg' },
    ])

    renderWithProvider()
    await act(async () => screen.getByText('Fetch').click())

    const recipes = JSON.parse(screen.getByTestId('recipes').textContent)
    expect(recipes).toHaveLength(1)
    expect(recipes[0].source).toBe('spoonacular')
  })

  it('returns multiple results when names differ', async () => {
    fetchSpoonacularRecipes.mockResolvedValue([
      { id: 200, title: 'Tomato Soup', image: 'img.jpg' },
      { id: 201, title: 'Chicken Curry', image: 'img2.jpg' },
    ])

    renderWithProvider()
    await act(async () => screen.getByText('Fetch').click())

    const recipes = JSON.parse(screen.getByTestId('recipes').textContent)
    expect(recipes).toHaveLength(2)
  })

  it('sets error when API fails and returns empty results', async () => {
    fetchSpoonacularRecipes.mockRejectedValue(new Error('API down'))

    renderWithProvider()
    await act(async () => screen.getByText('Fetch').click())

    expect(screen.getByTestId('error').textContent).toContain('one or more APIs failed')
    const recipes = JSON.parse(screen.getByTestId('recipes').textContent)
    expect(recipes).toHaveLength(0)
  })

  it('sets loading to false after fetch completes', async () => {
    fetchSpoonacularRecipes.mockResolvedValue([])

    renderWithProvider()

    // Before clicking, loading should be false
    expect(screen.getByTestId('loading').textContent).toBe('false')

    await act(async () => screen.getByText('Fetch').click())

    // After fetch completes, loading should be false again
    expect(screen.getByTestId('loading').textContent).toBe('false')
  })

  it('useRecipeContext throws when used outside of RecipeProvider', () => {
    // Suppress React error boundary console output for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function BadComponent() {
      useRecipeContext()
      return null
    }

    expect(() => render(<BadComponent />)).toThrow(
      'useRecipeContext must be used within a RecipeProvider'
    )

    spy.mockRestore()
  })
})

// SCRUM-119: Tests for smart re-search — skip API when same ingredients,
// exclusion only added. Re-fetch when exclusion removed or ingredients change.

// Recipes with extendedIngredients so the client-side filter can match by name
const peanutRecipe = {
  id: 1,
  title: 'Peanut Chicken',
  matchScore: 1,
  instructions: 'Mix peanuts with chicken and cook.',
  extendedIngredients: [{ name: 'chicken' }, { name: 'peanuts' }],
}

const garlicRecipe = {
  id: 2,
  title: 'Garlic Chicken',
  matchScore: 1,
  instructions: 'Cook chicken with garlic.',
  extendedIngredients: [{ name: 'chicken' }, { name: 'garlic' }],
}

// TestConsumer with controls for ingredients, exclusions, and re-search
function SmartSearchConsumer() {
  const { recipes, fetchRecipes, addExclusion, removeExclusion } = useRecipeContext()
  const [ingredients, setIngredients] = useState(['chicken'])
  return (
    <div>
      <span data-testid="count">{recipes.length}</span>
      <span data-testid="recipes">{JSON.stringify(recipes)}</span>
      <button data-testid="fetch" onClick={() => fetchRecipes(ingredients)}>Fetch</button>
      <button data-testid="use-beef" onClick={() => setIngredients(['beef'])}>Use Beef</button>
      <button data-testid="add-peanuts" onClick={() => addExclusion('peanuts')}>Add Peanuts</button>
      <button data-testid="remove-peanuts" onClick={() => removeExclusion('peanuts')}>Remove Peanuts</button>
    </div>
  )
}

describe('RecipeContext — SCRUM-119 smart re-search', () => {

  it('skips API call when same ingredients re-searched with only an exclusion added', async () => {
    fetchSpoonacularRecipes.mockResolvedValue([garlicRecipe, peanutRecipe])
    render(<RecipeProvider><SmartSearchConsumer /></RecipeProvider>)

    // First search — fresh API call
    await act(async () => screen.getByTestId('fetch').click())
    expect(fetchSpoonacularRecipes).toHaveBeenCalledTimes(1)

    // Add exclusion then re-search same ingredients
    await act(async () => screen.getByTestId('add-peanuts').click())
    await act(async () => screen.getByTestId('fetch').click())

    // API should NOT have been called again
    expect(fetchSpoonacularRecipes).toHaveBeenCalledTimes(1)
  })

  it('filters out recipes containing the excluded ingredient using extendedIngredients', async () => {
    fetchSpoonacularRecipes.mockResolvedValue([garlicRecipe, peanutRecipe])
    render(<RecipeProvider><SmartSearchConsumer /></RecipeProvider>)

    // First search — both recipes returned
    await act(async () => screen.getByTestId('fetch').click())
    expect(JSON.parse(screen.getByTestId('recipes').textContent)).toHaveLength(2)

    // Add peanuts exclusion and re-search
    await act(async () => screen.getByTestId('add-peanuts').click())
    await act(async () => screen.getByTestId('fetch').click())

    // Peanut recipe filtered out, garlic recipe remains
    const recipes = JSON.parse(screen.getByTestId('recipes').textContent)
    expect(recipes).toHaveLength(1)
    expect(recipes[0].name).toBe('garlic chicken')
  })

  it('triggers a new API call when an exclusion is removed', async () => {
    fetchSpoonacularRecipes.mockResolvedValue([garlicRecipe])
    render(<RecipeProvider><SmartSearchConsumer /></RecipeProvider>)

    // First search with peanuts excluded
    await act(async () => screen.getByTestId('add-peanuts').click())
    await act(async () => screen.getByTestId('fetch').click())
    expect(fetchSpoonacularRecipes).toHaveBeenCalledTimes(1)

    // Remove peanuts and re-search — peanut recipes need to come back
    await act(async () => screen.getByTestId('remove-peanuts').click())
    await act(async () => screen.getByTestId('fetch').click())
    expect(fetchSpoonacularRecipes).toHaveBeenCalledTimes(2)
  })

  it('triggers a new API call when ingredients change', async () => {
    fetchSpoonacularRecipes.mockResolvedValue([garlicRecipe])
    render(<RecipeProvider><SmartSearchConsumer /></RecipeProvider>)

    // First search with chicken
    await act(async () => screen.getByTestId('fetch').click())
    expect(fetchSpoonacularRecipes).toHaveBeenCalledTimes(1)

    // Change ingredients to beef and re-search
    await act(async () => screen.getByTestId('use-beef').click())
    await act(async () => screen.getByTestId('fetch').click())
    expect(fetchSpoonacularRecipes).toHaveBeenCalledTimes(2)
  })
})
