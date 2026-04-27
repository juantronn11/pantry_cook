// RecipeGrid.test.jsx
// Unit tests for src/components/RecipeGrid/RecipeGrid.jsx
// Mocks useRecipeContext to control all external state
// Mocks RecipeTile so tests stay focused on the grid's own logic

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecipeGrid from '../../../src/components/RecipeGrid/RecipeGrid';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Stub RecipeTile — we only care that the grid renders one tile per recipe
vi.mock('../../../src/components/RecipeTile/RecipeTile', () => ({
  default: ({ recipe }) => (
    <div data-testid="recipe-tile">{recipe.raw.title}</div>
  ),
}));

// Stub the loading SVG import so jsdom doesn't choke on it
vi.mock('../../../src/components/RecipeGrid/loading.svg', () => ({
  default: 'loading.svg',
}));

// We control the context return value per test via this shared object
const mockContextValue = {
  recipes:             [],
  loading:             false,
  ingredients:         [],
  excludedIngredients: [],
};

vi.mock('../../../src/context/RecipeContext', () => ({
  useRecipeContext: () => mockContextValue,
}));

// Silence scrollIntoView — jsdom does not implement it
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  // Reset context defaults before each test
  mockContextValue.recipes             = [];
  mockContextValue.loading             = false;
  mockContextValue.ingredients         = [];
  mockContextValue.excludedIngredients = [];
});

// ---------------------------------------------------------------------------
// Helper: build a minimal recipe object
// ---------------------------------------------------------------------------

const makeRecipe = (id, title = `Recipe ${id}`) => ({
  id,
  raw: { title, image: 'img.jpg' },
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RecipeGrid', () => {

  it('renders a loading spinner when loading is true', () => {
    mockContextValue.loading     = true;
    mockContextValue.ingredients = ['chicken'];

    render(<RecipeGrid />);

    const spinner = screen.getByAltText('Loading... maybe');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryAllByTestId('recipe-tile')).toHaveLength(0);
  });

  it('renders one tile per recipe when recipes are present', () => {
    mockContextValue.recipes     = [makeRecipe(1), makeRecipe(2), makeRecipe(3)];
    mockContextValue.ingredients = ['chicken'];

    render(<RecipeGrid />);

    const tiles = screen.getAllByTestId('recipe-tile');
    expect(tiles).toHaveLength(3);
    expect(screen.queryByText(/no recipes found/i)).not.toBeInTheDocument();
  });

  it('shows excluded-ingredients message when recipes empty and excludedIngredients is populated', () => {
    mockContextValue.recipes             = [];
    mockContextValue.loading             = false;
    mockContextValue.ingredients         = ['chicken'];
    mockContextValue.excludedIngredients = ['garlic'];

    render(<RecipeGrid />);

    expect(
      screen.getByText(/try removing some excluded ingredients/i)
    ).toBeInTheDocument();
    expect(screen.queryAllByTestId('recipe-tile')).toHaveLength(0);
  });

  it('shows default empty message when recipes empty and no excluded ingredients', () => {
    mockContextValue.recipes             = [];
    mockContextValue.loading             = false;
    mockContextValue.ingredients         = ['chicken'];
    mockContextValue.excludedIngredients = [];

    render(<RecipeGrid />);

    expect(
      screen.getByText(/try adding some ingredients to search/i)
    ).toBeInTheDocument();
  });

  it('renders recipes from recipesProp instead of context when prop is provided', () => {
    // Context has 3 recipes — prop has only 1
    mockContextValue.recipes = [makeRecipe(1), makeRecipe(2), makeRecipe(3)];
    const propRecipes = [makeRecipe(99, 'Prop Recipe')];

    render(<RecipeGrid recipes={propRecipes} />);

    const tiles = screen.getAllByTestId('recipe-tile');
    expect(tiles).toHaveLength(1);
    expect(screen.getByText('Prop Recipe')).toBeInTheDocument();
  });

});
