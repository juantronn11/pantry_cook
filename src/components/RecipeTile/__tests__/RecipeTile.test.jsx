// Unit tests for RecipeTile component (src/components/RecipeTile/RecipeTile.jsx)
//
// RecipeTile renders a recipe card and opens a modal with full details on click.
// All recipes come from Spoonacular — raw data is pre-loaded so no API call is
// needed when opening the modal.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipeTile from '../RecipeTile'

beforeEach(() => {
  vi.restoreAllMocks()
})

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

  it('renders Spoonacular recipe name and image', () => {
    render(<RecipeTile recipe={spoonacularRecipe} />)
    expect(screen.getByText('Tomato Soup')).toBeInTheDocument()
    expect(screen.getByAltText('Tomato Soup')).toHaveAttribute('src', 'https://example.com/soup.jpg')
  })

  it('shows [spoonacular] source label in orange', () => {
    render(<RecipeTile recipe={spoonacularRecipe} />)
    const label = screen.getByText('[spoonacular]')
    expect(label).toBeInTheDocument()
    expect(label.style.color).toBe('orange')
  })
})

describe('RecipeTile — click handler', () => {

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
