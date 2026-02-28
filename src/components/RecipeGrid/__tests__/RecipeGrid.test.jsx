// Unit tests for RecipeGrid component (src/components/RecipeGrid/RecipeGrid.jsx)
//
// RecipeGrid reads recipes and loading from RecipeContext, so we mock
// useRecipeContext to control what data the component receives.

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RecipeGrid from '../RecipeGrid'

// Mock the context hook so we can control recipes/loading values
vi.mock('../../../context/RecipeContext', () => ({
  useRecipeContext: vi.fn(),
}))

import { useRecipeContext } from '../../../context/RecipeContext'

describe('RecipeGrid', () => {

  it('shows loading text when loading is true', () => {
    useRecipeContext.mockReturnValue({ recipes: [], loading: true })
    render(<RecipeGrid />)
    expect(screen.getByText('...loading')).toBeInTheDocument()
  })

  it('does not show loading text when loading is false', () => {
    useRecipeContext.mockReturnValue({ recipes: [], loading: false })
    render(<RecipeGrid />)
    expect(screen.queryByText('...loading')).not.toBeInTheDocument()
  })

  it('renders a recipe tile for each recipe', () => {
    const mockRecipes = [
      { id: 'mealdb-1', name: 'chicken curry', source: 'mealdb', raw: { strMeal: 'Chicken Curry', strMealThumb: 'img1.jpg' } },
      { id: 'spoonacular-2', name: 'tomato soup', source: 'spoonacular', raw: { title: 'Tomato Soup', image: 'img2.jpg' } },
    ]
    useRecipeContext.mockReturnValue({ recipes: mockRecipes, loading: false })
    render(<RecipeGrid />)

    // Each RecipeTile renders the recipe name as text
    expect(screen.getByText('Chicken Curry')).toBeInTheDocument()
    expect(screen.getByText('Tomato Soup')).toBeInTheDocument()
  })

  it('renders empty grid when there are no recipes', () => {
    useRecipeContext.mockReturnValue({ recipes: [], loading: false })
    const { container } = render(<RecipeGrid />)

    // The grid div exists but has no children
    const grid = container.querySelector('.recipeGrid')
    expect(grid).toBeInTheDocument()
    expect(grid.children).toHaveLength(0)
  })
})
