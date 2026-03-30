// Unit tests for RecipeGrid component (src/components/RecipeGrid/RecipeGrid.jsx)
//
// RecipeGrid reads recipes and loading from RecipeContext, so we mock
// useRecipeContext to control what data the component receives.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RecipeGrid from '../RecipeGrid'

// Mock the context hook so we can control recipes/loading values
vi.mock('../../../context/RecipeContext', () => ({
  useRecipeContext: vi.fn(),
}))

import { useRecipeContext } from '../../../context/RecipeContext'

// Base mock return value — includes all fields RecipeGrid and its child
// RecipeTile components read from context
const baseMock = {
  recipes: [],
  loading: false,
  ingredients: [],
  excludedIngredients: [],
  saveRecipe: vi.fn(),
  removeSavedRecipe: vi.fn(),
  isRecipeSaved: vi.fn().mockReturnValue(false),
}

// jsdom doesn't implement scrollIntoView — provide a no-op stub
// so the useEffect in RecipeGrid doesn't throw
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
  useRecipeContext.mockReturnValue(baseMock)
})

describe('RecipeGrid', () => {

  it('shows loading spinner when loading is true', () => {
    useRecipeContext.mockReturnValue({ ...baseMock, loading: true })
    render(<RecipeGrid />)
    // Miguel replaced the text with an SVG spinner that has alt="Loading..."
    expect(screen.getByAltText('Loading...')).toBeInTheDocument()
  })

  it('does not show loading spinner when loading is false', () => {
    render(<RecipeGrid />)
    expect(screen.queryByAltText('Loading...')).not.toBeInTheDocument()
  })

  it('renders a recipe tile for each recipe', () => {
    const mockRecipes = [
      { id: 'spoonacular-1', name: 'chicken curry', source: 'spoonacular', raw: { title: 'Chicken Curry', image: 'img1.jpg' } },
      { id: 'spoonacular-2', name: 'tomato soup', source: 'spoonacular', raw: { title: 'Tomato Soup', image: 'img2.jpg' } },
    ]
    useRecipeContext.mockReturnValue({ ...baseMock, recipes: mockRecipes, ingredients: ['chicken'] })
    render(<RecipeGrid />)

    // Each RecipeTile renders the recipe name as text
    expect(screen.getByText('Chicken Curry')).toBeInTheDocument()
    expect(screen.getByText('Tomato Soup')).toBeInTheDocument()
  })

  it('shows empty state message when there are no recipes but ingredients were selected', () => {
    // ingredients has items = user searched, but no recipes came back
    useRecipeContext.mockReturnValue({ ...baseMock, ingredients: ['chicken'] })
    render(<RecipeGrid />)

    // Miguel added an early return with this message when recipes is empty
    expect(screen.getByText('No recipes found. Try adding some ingredients to search!')).toBeInTheDocument()
  })
})
