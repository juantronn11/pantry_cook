// Unit tests for RecipeContext (src/context/RecipeContext.jsx)
//
// These tests verify the fetchRecipes function which:
//   1. Calls both MealDB and Spoonacular APIs concurrently
//   2. Normalizes responses to a common { id, name, source, raw } shape
//   3. Deduplicates by name (MealDB takes priority)
//   4. Manages loading/error state
//
// The API modules are mocked so we test only the context logic.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { RecipeProvider, useRecipeContext } from '../RecipeContext'

// Mock both API modules — we don't want real fetch calls here.
// We're testing the context's normalization/dedup logic, not the APIs.
vi.mock('../../api/mealdb', () => ({
  fetchMealDBRecipes: vi.fn(),
}))
vi.mock('../../api/spoonacular', () => ({
  fetchSpoonacularRecipes: vi.fn(),
}))

// Import the mocked functions so we can control their return values
import { fetchMealDBRecipes } from '../../api/mealdb'
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

  it('normalizes MealDB results to { id, name, source, raw } shape', async () => {
    fetchMealDBRecipes.mockResolvedValue([
      { idMeal: '100', strMeal: 'Chicken Curry', strMealThumb: 'img.jpg' },
    ])
    fetchSpoonacularRecipes.mockResolvedValue([])

    renderWithProvider()
    await act(async () => screen.getByText('Fetch').click())

    const recipes = JSON.parse(screen.getByTestId('recipes').textContent)
    expect(recipes).toHaveLength(1)
    expect(recipes[0].id).toBe('mealdb-100')
    expect(recipes[0].name).toBe('chicken curry')
    expect(recipes[0].source).toBe('mealdb')
    expect(recipes[0].raw.strMeal).toBe('Chicken Curry')
  })

  it('normalizes Spoonacular results to { id, name, source, raw } shape', async () => {
    fetchMealDBRecipes.mockResolvedValue([])
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

  it('deduplicates by name — MealDB takes priority over Spoonacular', async () => {
    // Both APIs return a recipe called "Chicken Curry"
    fetchMealDBRecipes.mockResolvedValue([
      { idMeal: '100', strMeal: 'Chicken Curry', strMealThumb: 'img.jpg' },
    ])
    fetchSpoonacularRecipes.mockResolvedValue([
      { id: 200, title: 'Chicken Curry', image: 'img.jpg' },
    ])

    renderWithProvider()
    await act(async () => screen.getByText('Fetch').click())

    const recipes = JSON.parse(screen.getByTestId('recipes').textContent)
    // Only one "chicken curry" — the MealDB version
    expect(recipes).toHaveLength(1)
    expect(recipes[0].source).toBe('mealdb')
  })

  it('merges results from both APIs when names differ', async () => {
    fetchMealDBRecipes.mockResolvedValue([
      { idMeal: '100', strMeal: 'Chicken Curry', strMealThumb: 'img.jpg' },
    ])
    fetchSpoonacularRecipes.mockResolvedValue([
      { id: 200, title: 'Tomato Soup', image: 'img.jpg' },
    ])

    renderWithProvider()
    await act(async () => screen.getByText('Fetch').click())

    const recipes = JSON.parse(screen.getByTestId('recipes').textContent)
    expect(recipes).toHaveLength(2)
    expect(recipes[0].source).toBe('mealdb')
    expect(recipes[1].source).toBe('spoonacular')
  })

  it('sets error when one API fails but still returns results from the other', async () => {
    fetchMealDBRecipes.mockResolvedValue([
      { idMeal: '100', strMeal: 'Chicken Curry', strMealThumb: 'img.jpg' },
    ])
    // Spoonacular fails
    fetchSpoonacularRecipes.mockRejectedValue(new Error('API down'))

    renderWithProvider()
    await act(async () => screen.getByText('Fetch').click())

    // Error message is set
    expect(screen.getByTestId('error').textContent).toContain('one or more APIs failed')
    // MealDB results still come through
    const recipes = JSON.parse(screen.getByTestId('recipes').textContent)
    expect(recipes).toHaveLength(1)
    expect(recipes[0].source).toBe('mealdb')
  })

  it('sets loading to false after fetch completes', async () => {
    fetchMealDBRecipes.mockResolvedValue([])
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
