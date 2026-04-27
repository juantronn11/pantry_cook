// RecipeTile.test.jsx
// Unit tests for src/components/RecipeTile/RecipeTile.jsx
// Covers: modal open/close, save/remove toggle, image error fallback,
//         and servings adjustment controls (SCRUM-164)

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeTile from '../../../src/components/RecipeTile/RecipeTile';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSaveRecipe        = vi.fn();
const mockRemoveSavedRecipe = vi.fn();
const mockIsRecipeSaved     = vi.fn(() => false);

vi.mock('../../../src/context/RecipeContext', () => ({
  useRecipeContext: () => ({
    saveRecipe:        mockSaveRecipe,
    removeSavedRecipe: mockRemoveSavedRecipe,
    isRecipeSaved:     mockIsRecipeSaved,
  }),
}));

// Default: authenticated — mutated per test as needed
const mockAuthState = { isAuthenticated: true };
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => mockAuthState,
}));

// Stub child components that are not under test
vi.mock('../../../src/components/DownloadButton/DownloadButton',        () => ({ default: () => <div /> }));
vi.mock('../../../src/components/ShoppingListButton/ShoppingListButton', () => ({ default: () => <div /> }));

// Stub media imports
vi.mock('../../../media/error_thumbnail.jpg', () => ({ default: 'error_thumb.jpg' }));
vi.mock('../../../media/error_image.jpg',     () => ({ default: 'error_image.jpg' }));

// Stub scaleIngredients — return the array unchanged so tests stay simple
vi.mock('../../../src/utils/scaleIngredients', () => ({
  scaleIngredients: (ings) => ings,
}));

// ---------------------------------------------------------------------------
// Recipe fixture
// ---------------------------------------------------------------------------

const RECIPE = {
  id: 1,
  raw: {
    title:               'Test Pasta',
    image:               'pasta.jpg',
    servings:            4,
    readyInMinutes:      30,
    dishTypes:           ['dinner'],
    cuisines:            ['Italian'],
    instructions:        'Boil water. Cook pasta. Serve.',
    extendedIngredients: [
      { name: 'pasta', amount: 200, unit: 'g' },
      { name: 'sauce', amount: 100, unit: 'ml' },
    ],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAuthState.isAuthenticated = true;
  mockIsRecipeSaved.mockReturnValue(false);
});

// ---------------------------------------------------------------------------
// Helper: click the thumbnail to open the modal
// ---------------------------------------------------------------------------

function openModal() {
  const img = screen.getByRole('img', { name: 'Test Pasta' });
  fireEvent.click(img);
}

// ---------------------------------------------------------------------------
// Modal open / close
// ---------------------------------------------------------------------------

describe('RecipeTile — modal open / close', () => {

  it('does not render the modal before the thumbnail is clicked', () => {
    render(<RecipeTile recipe={RECIPE} />);
    expect(screen.queryByText('Boil water. Cook pasta. Serve.')).not.toBeInTheDocument();
  });

  it('renders modal content after the thumbnail is clicked', async () => {
    render(<RecipeTile recipe={RECIPE} />);
    openModal();

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Test Pasta' })).toBeInTheDocument());
    expect(screen.getByText(/Italian/i)).toBeInTheDocument();
    expect(screen.getByText(/dinner/i)).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getByText('Boil water. Cook pasta. Serve.')).toBeInTheDocument();
  });

  it('closes the modal when the X button is clicked', async () => {
    render(<RecipeTile recipe={RECIPE} />);
    openModal();

    await waitFor(() => screen.getByRole('heading', { name: 'Test Pasta' }));
    fireEvent.click(screen.getByRole('button', { name: 'X' }));

    expect(screen.queryByText('Boil water. Cook pasta. Serve.')).not.toBeInTheDocument();
  });

  it('closes the modal when the overlay backdrop is clicked', async () => {
    render(<RecipeTile recipe={RECIPE} />);
    openModal();

    await waitFor(() => screen.getByRole('heading', { name: 'Test Pasta' }));
    const overlay = document.querySelector('[class*="overlay"]');
    fireEvent.click(overlay);

    expect(screen.queryByText('Boil water. Cook pasta. Serve.')).not.toBeInTheDocument();
  });

});

// ---------------------------------------------------------------------------
// Save / remove toggle
// ---------------------------------------------------------------------------

describe('RecipeTile — save / remove toggle', () => {

  it('calls saveRecipe with the recipe when "Save to Library" is clicked', async () => {
    mockIsRecipeSaved.mockReturnValue(false);
    render(<RecipeTile recipe={RECIPE} />);
    openModal();

    await waitFor(() => screen.getByRole('button', { name: /save to library/i }));
    fireEvent.click(screen.getByRole('button', { name: /save to library/i }));

    expect(mockSaveRecipe).toHaveBeenCalledWith(RECIPE);
  });

  it('calls removeSavedRecipe with recipe.id when "Remove from Library" is clicked', async () => {
    mockIsRecipeSaved.mockReturnValue(true);
    render(<RecipeTile recipe={RECIPE} />);
    openModal();

    await waitFor(() => screen.getByRole('button', { name: /remove from library/i }));
    fireEvent.click(screen.getByRole('button', { name: /remove from library/i }));

    expect(mockRemoveSavedRecipe).toHaveBeenCalledWith(RECIPE.id);
  });

  it('shows error message when saveRecipe throws', async () => {
    mockSaveRecipe.mockRejectedValueOnce(new Error('Network error'));
    render(<RecipeTile recipe={RECIPE} />);
    openModal();

    await waitFor(() => screen.getByRole('button', { name: /save to library/i }));
    fireEvent.click(screen.getByRole('button', { name: /save to library/i }));

    await waitFor(() =>
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument()
    );
  });

  it('does not render the save button when user is not authenticated', async () => {
    mockAuthState.isAuthenticated = false;
    render(<RecipeTile recipe={RECIPE} />);
    openModal();

    await waitFor(() => screen.getByRole('heading', { name: 'Test Pasta' }));
    expect(screen.queryByRole('button', { name: /save to library/i })).not.toBeInTheDocument();
  });

});

// ---------------------------------------------------------------------------
// Image error fallback
// ---------------------------------------------------------------------------

describe('RecipeTile — image error fallback', () => {

  it('replaces src with errorThumb and sets alt to "Error" on image load failure', () => {
    render(<RecipeTile recipe={RECIPE} />);

    const img = screen.getByRole('img', { name: 'Test Pasta' });
    fireEvent.error(img);

    expect(img.src).toContain('error_thumb.jpg');
    expect(img.alt).toBe('Error');
  });

});

// ---------------------------------------------------------------------------
// Servings control
// ---------------------------------------------------------------------------

describe('RecipeTile — servings control', () => {

  async function renderAndOpenModal(recipe = RECIPE) {
    render(<RecipeTile recipe={recipe} />);
    const img = screen.getByRole('img', { name: recipe.raw.title });
    fireEvent.click(img);
    await waitFor(() => screen.getByLabelText(/increase servings/i));
  }

  it('initialises servings to recipe.raw.servings', async () => {
    await renderAndOpenModal();
    expect(screen.getByText('4')).toBeInTheDocument(); // RECIPE.raw.servings = 4
  });

  it('increments servings when + is clicked', async () => {
    await renderAndOpenModal();
    fireEvent.click(screen.getByLabelText(/increase servings/i));
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('decrements servings when - is clicked', async () => {
    await renderAndOpenModal();
    fireEvent.click(screen.getByLabelText(/increase servings/i)); // 5
    fireEvent.click(screen.getByLabelText(/decrease servings/i)); // back to 4
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('disables the - button when servings is 1', async () => {
    const singleServing = { ...RECIPE, raw: { ...RECIPE.raw, servings: 1 } };
    await renderAndOpenModal(singleServing);
    expect(screen.getByLabelText(/decrease servings/i)).toBeDisabled();
  });

  it('resets servings to original value when Reset is clicked', async () => {
    await renderAndOpenModal();
    fireEvent.click(screen.getByLabelText(/increase servings/i)); // 5
    fireEvent.click(screen.getByLabelText(/increase servings/i)); // 6
    fireEvent.click(screen.getByLabelText(/reset servings to original/i));
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('disables the Reset button when servings equals the original value', async () => {
    await renderAndOpenModal();
    expect(screen.getByLabelText(/reset servings to original/i)).toBeDisabled();
  });

});
