// Unit tests for RecipeTile component (src/components/RecipeTile/RecipeTile.jsx)
//
// RecipeTile renders a recipe card and opens a modal with full details on click.
// The click handler is source-aware: MealDB recipes fetch from the lookup API,
// Spoonacular recipes use pre-loaded raw data (no API call).
// All fetch calls are mocked.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipeTile from '../RecipeTile'

beforeEach(() => {
  vi.restoreAllMocks()
})

// Mock MealDB recipe (normalized shape from RecipeContext)
const mealdbRecipe = {
  id: 'mealdb-100',
  name: 'chicken curry',
  source: 'mealdb',
  raw: {
    idMeal: '100',
    strMeal: 'Chicken Curry',
    strMealThumb: 'https://example.com/chicken.jpg',
  },
}

// Mock Spoonacular recipe (normalized shape from RecipeContext)
const spoonacularRecipe = {
  id: 'spoonacular-200',
  name: 'tomato soup',
  source: 'spoonacular',
  raw: {
    id: 200,
    title: 'Tomato Soup',
    image: 'https://example.com/soup.jpg',
    instructions: 'Boil tomatoes. Blend. Season.',
    dishTypes: ['soup', 'lunch'],
    cuisines: ['Italian'],
    extendedIngredients: [
      { name: 'tomato', amount: 4, unit: 'pieces' },
      { name: 'salt', amount: 1, unit: 'tsp' },
    ],
  },
}

describe('RecipeTile — rendering', () => {

  it('renders MealDB recipe name and image', () => {
    render(<RecipeTile recipe={mealdbRecipe} />)
    expect(screen.getByText('Chicken Curry')).toBeInTheDocument()
    expect(screen.getByAltText('Chicken Curry')).toHaveAttribute('src', 'https://example.com/chicken.jpg')
  })

  it('renders Spoonacular recipe name and image', () => {
    render(<RecipeTile recipe={spoonacularRecipe} />)
    expect(screen.getByText('Tomato Soup')).toBeInTheDocument()
    expect(screen.getByAltText('Tomato Soup')).toHaveAttribute('src', 'https://example.com/soup.jpg')
  })

  it('shows [mealdb] source label in green for MealDB recipes', () => {
    render(<RecipeTile recipe={mealdbRecipe} />)
    const label = screen.getByText('[mealdb]')
    expect(label).toBeInTheDocument()
    expect(label.style.color).toBe('green')
  })

  it('shows [spoonacular] source label in orange for Spoonacular recipes', () => {
    render(<RecipeTile recipe={spoonacularRecipe} />)
    const label = screen.getByText('[spoonacular]')
    expect(label).toBeInTheDocument()
    expect(label.style.color).toBe('orange')
  })
})

describe('RecipeTile — MealDB click handler', () => {

  it('opens modal with recipe details after clicking a MealDB tile', async () => {
    const user = userEvent.setup()

    // Mock the lookup API response
    const fullMeal = {
      strMeal: 'Chicken Curry',
      strMealThumb: 'https://example.com/chicken.jpg',
      strCategory: 'Chicken',
      strArea: 'Indian',
      strInstructions: 'Cook the chicken with curry spices.',
      strIngredient1: 'Chicken',
      strMeasure1: '500g',
    }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ meals: [fullMeal] }),
    })

    render(<RecipeTile recipe={mealdbRecipe} />)
    await act(async () => {
      await user.click(screen.getByAltText('Chicken Curry'))
    })

    // Modal should show full recipe details — use getByRole to target the
    // modal's <h2> specifically (the tile also has the name in a <p>)
    expect(screen.getByRole('heading', { name: 'Chicken Curry' })).toBeInTheDocument()
    expect(screen.getByText(/Cook the chicken with curry spices/)).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('shows error message when MealDB fetch fails', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    render(<RecipeTile recipe={mealdbRecipe} />)
    await act(async () => {
      await user.click(screen.getByAltText('Chicken Curry'))
    })

    expect(screen.getByText('Unable to get recipe')).toBeInTheDocument()
  })
})

describe('RecipeTile — Spoonacular click handler', () => {

  it('opens modal using raw data without making a fetch call', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn()

    render(<RecipeTile recipe={spoonacularRecipe} />)
    await act(async () => {
      await user.click(screen.getByAltText('Tomato Soup'))
    })

    // Modal should show transformed Spoonacular data — use getByRole for the
    // modal <h2> since the tile <p> also contains the recipe name
    expect(screen.getByRole('heading', { name: 'Tomato Soup' })).toBeInTheDocument()
    expect(screen.getByText(/Boil tomatoes/)).toBeInTheDocument()
    expect(screen.getByText(/soup, lunch/)).toBeInTheDocument()  // dishTypes → Category
    expect(screen.getByText(/Italian/)).toBeInTheDocument()       // cuisines → Area

    // No fetch call should have been made
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('displays transformed ingredients from Spoonacular data', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn()

    render(<RecipeTile recipe={spoonacularRecipe} />)
    await act(async () => {
      await user.click(screen.getByAltText('Tomato Soup'))
    })

    // Ingredients should be mapped from extendedIngredients
    // Use getAllByText for "tomato" since it appears in both the ingredient
    // list and the instructions text ("Boil tomatoes...")
    expect(screen.getAllByText(/tomato/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/salt/)).toBeInTheDocument()
  })
})
