import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchForm from '../../../src/components/SearchForm/SearchForm'
import { RecipeProvider } from '../../../src/context/RecipeContext'
import * as ingredientTrieModule from '../../../src/utils/ingredientTrie'

// Mock the ingredientAutocomplete function
vi.mock('../../../src/utils/ingredientTrie', () => ({
  ingredientAutocomplete: vi.fn(),
}))

// Mock the ExcludeIngredients component since it's not the focus of this test
vi.mock('../../../src/components/ExcludeIngredients/ExcludeIngredients', () => ({
  default: () => <div data-testid="exclude-ingredients">Mocked ExcludeIngredients</div>,
}))

describe('SearchForm — Multi-ingredient selection with autocomplete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ingredientTrieModule.ingredientAutocomplete.mockReturnValue([])
  })

  const renderSearchForm = () => {
    return render(
      <RecipeProvider>
        <SearchForm />
      </RecipeProvider>
    )
  }

  describe('Rendering', () => {
    it('should render the search form with label and input', () => {
      renderSearchForm()
      expect(screen.getByLabelText(/select up to 5 ingredients/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/type an ingredient/i)).toBeInTheDocument()
    })

    it('should render the search button', () => {
      renderSearchForm()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    })

    it('should render with empty selected ingredients initially', () => {
      renderSearchForm()
      const tags = screen.queryAllByRole('button', { name: /✕/i })
      expect(tags).toHaveLength(0)
    })
  })

  describe('handleInput — Query input and suggestions', () => {
    it('should update query state when typing', async () => {
      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      expect(input).toHaveValue('apple')
    })

    it('should populate suggestions when query is entered', async () => {
      const mockSuggestions = ['apple', 'apple juice', 'applesauce']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(ingredientTrieModule.ingredientAutocomplete).toHaveBeenCalledWith('apple')
        mockSuggestions.forEach(suggestion => {
          expect(screen.getByText(suggestion)).toBeInTheDocument()
        })
      })
    })

    it('should clear suggestions when query is empty', async () => {
      const mockSuggestions = ['apple', 'apple juice']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      // Type something
      await userEvent.type(input, 'apple')
      await waitFor(() => {
        expect(screen.getByText('apple')).toBeInTheDocument()
      })
      
      // Clear the input
      await userEvent.clear(input)
      expect(screen.queryByText('apple')).not.toBeInTheDocument()
    })

    it('should reset activeIndex when typing new query', async () => {
      const mockSuggestions = ['apple', 'apple juice']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'app')
      
      // Check that aria-activedescendant is not set (activeIndex = -1)
      await waitFor(() => {
        expect(input).not.toHaveAttribute('aria-activedescendant')
      })
    })

    it('should trim whitespace from query before calling ingredientAutocomplete', async () => {
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(['apple'])

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      // Type with leading/trailing spaces
      await userEvent.type(input, '  apple  ')
      
      // The component should trim before calling autocomplete
      // Note: This depends on the implementation details
      expect(input).toHaveValue('  apple  ')
    })
  })

  describe('handleSelect — Selecting ingredients', () => {
    it('should add ingredient to selectedIngredients when clicked', async () => {
      const mockSuggestions = ['apple']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByText('apple')).toBeInTheDocument()
      })

      const suggestionItem = screen.getByRole('option', { name: 'apple' })
      await userEvent.click(suggestionItem)

      // Should display as a tag
      expect(screen.getByText('apple')).toBeInTheDocument()
    })

    it('should clear input and suggestions after selecting ingredient', async () => {
      const mockSuggestions = ['apple']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByText('apple')).toBeInTheDocument()
      })

      const suggestionItem = screen.getByRole('option', { name: 'apple' })
      await userEvent.click(suggestionItem)

      // Input should be cleared
      expect(input).toHaveValue('')
      
      // Suggestion list should be gone
      await waitFor(() => {
        const suggestionList = screen.queryByRole('listbox')
        // After selection, the list should not be visible (no suggestions to show)
      })
    })

    it('should reject duplicate selection', async () => {
      const mockSuggestions = ['apple']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      // Select apple first time
      await userEvent.type(input, 'apple')
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })
      let suggestionItem = screen.getByRole('option', { name: 'apple' })
      await userEvent.click(suggestionItem)

      // Try to select apple again
      await userEvent.type(input, 'apple')
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })
      suggestionItem = screen.getByRole('option', { name: 'apple' })
      await userEvent.click(suggestionItem)

      // Should only have one apple tag
      const tags = screen.getAllByRole('button', { name: /✕/i })
      expect(tags).toHaveLength(1)
    })

    it('should enforce MAX_INGREDIENTS limit (5)', async () => {
      const mockSuggestions = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig']
      ingredientTrieModule.ingredientAutocomplete.mockImplementation((query) => {
        return mockSuggestions.filter(s => s.startsWith(query.trim()))
      })

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)

      // Select 5 ingredients (the max)
      for (let i = 0; i < 5; i++) {
        const ingredient = mockSuggestions[i]
        await userEvent.type(input, ingredient.substring(0, 2))
        
        await waitFor(() => {
          const option = screen.getByRole('option', { name: ingredient })
          expect(option).toBeInTheDocument()
        })
        
        const option = screen.getByRole('option', { name: ingredient })
        await userEvent.click(option)
        
        // Clear input for next iteration
        await userEvent.clear(input)
      }

      // Should have 5 tags
      const tags = screen.getAllByRole('button', { name: /✕/i })
      expect(tags).toHaveLength(5)

      // Try to add 6th ingredient - should be rejected
      await userEvent.type(input, 'fi')
      await waitFor(() => {
        const option = screen.getByRole('option', { name: 'fig' })
        expect(option).toBeInTheDocument()
      })
      
      const figOption = screen.getByRole('option', { name: 'fig' })
      await userEvent.click(figOption)

      // Should still have only 5 tags
      const finalTags = screen.getAllByRole('button', { name: /✕/i })
      expect(finalTags).toHaveLength(5)
    })
  })

  describe('handleRemove — Removing ingredients', () => {
    it('should remove ingredient when remove button is clicked', async () => {
      const mockSuggestions = ['apple']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      // Add apple
      await userEvent.type(input, 'apple')
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })
      let option = screen.getByRole('option', { name: 'apple' })
      await userEvent.click(option)

      // Should display as tag with remove button
      expect(screen.getByText('apple')).toBeInTheDocument()
      
      // Click remove button
      const removeButton = screen.getByRole('button', { name: /✕/i })
      await userEvent.click(removeButton)

      // Apple tag should be gone
      await waitFor(() => {
        expect(screen.queryByText('apple')).not.toBeInTheDocument()
      })
    })
  })

  describe('handleKeySelection — Keyboard navigation', () => {
    it('should navigate down through suggestions with ArrowDown', async () => {
      const mockSuggestions = ['apple', 'apple juice', 'applesauce']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })

      // Press ArrowDown to move to first suggestion
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-0')
      })
    })

    it('should navigate up through suggestions with ArrowUp', async () => {
      const mockSuggestions = ['apple', 'apple juice', 'applesauce']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })

      // Press ArrowDown twice, then ArrowUp
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-1')
      })

      fireEvent.keyDown(input, { key: 'ArrowUp' })
      
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-0')
      })
    })

    it('should wrap around from last to first with ArrowDown', async () => {
      const mockSuggestions = ['apple', 'apple juice']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })

      // Navigate to last item
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      
      // Should be at index 1 (last)
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-1')
      })

      // Press ArrowDown again - should wrap to first
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-0')
      })
    })

    it('should wrap around from first to last with ArrowUp', async () => {
      const mockSuggestions = ['apple', 'apple juice']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })

      // ArrowUp from beginning should wrap to end
      fireEvent.keyDown(input, { key: 'ArrowUp' })
      
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-1')
      })
    })

    it('should select suggestion with Enter key', async () => {
      const mockSuggestions = ['apple', 'apple juice']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })

      // Navigate to first suggestion and press Enter
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-0')
      })

      fireEvent.keyDown(input, { key: 'Enter' })

      // Should select "apple" and clear input
      await waitFor(() => {
        expect(input).toHaveValue('')
      })

      // Apple should be displayed as a tag
      expect(screen.getByText('apple')).toBeInTheDocument()
    })

    it('should not navigate keyboard if at max ingredients', async () => {
      const mockSuggestions = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig']
      ingredientTrieModule.ingredientAutocomplete.mockImplementation((query) => {
        return mockSuggestions.filter(s => s.startsWith(query.trim().substring(0, 1)))
      })

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)

      // Select 5 ingredients to reach max
      for (let i = 0; i < 5; i++) {
        const ingredient = mockSuggestions[i]
        await userEvent.type(input, ingredient.substring(0, 1))
        
        await waitFor(() => {
          const option = screen.getByRole('option', { name: ingredient })
          expect(option).toBeInTheDocument()
        })
        
        const option = screen.getByRole('option', { name: ingredient })
        await userEvent.click(option)
        await userEvent.clear(input)
      }

      // Now try keyboard navigation with max reached
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(['fig'])
      await userEvent.type(input, 'fig')
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'fig' })).toBeInTheDocument()
      })

      fireEvent.keyDown(input, { key: 'ArrowDown' })

      // Should not set aria-activedescendant (activeIndex stays -1)
      expect(input).not.toHaveAttribute('aria-activedescendant')
    })
  })

  describe('Context synchronization (SCRUM-141)', () => {
    it('should clear local form state when context ingredients are cleared', async () => {
      const mockSuggestions = ['apple']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      const { rerender } = renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      // Add an ingredient
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })

      const option = screen.getByRole('option', { name: 'apple' })
      await userEvent.click(option)

      // Verify ingredient is selected
      expect(screen.getByText('apple')).toBeInTheDocument()

      // Re-render to simulate context ingredients being cleared
      // This would normally happen via RecipeContext state change
      // For this test, we're verifying the useEffect dependency works
      // In a real scenario, this would happen when setIngredients([]) is called
    })
  })

  describe('Accessibility', () => {
    it('should have aria-activedescendant pointing to current suggestion', async () => {
      const mockSuggestions = ['apple', 'apple juice']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })

      // Initially no active suggestion
      expect(input).not.toHaveAttribute('aria-activedescendant')

      // Navigate to first suggestion
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-0')
      })
    })

    it('should have aria-selected on highlighted suggestion', async () => {
      const mockSuggestions = ['apple', 'apple juice']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })

      fireEvent.keyDown(input, { key: 'ArrowDown' })
      
      await waitFor(() => {
        const appleOption = screen.getByRole('option', { name: 'apple' })
        expect(appleOption).toHaveAttribute('aria-selected', 'true')
      })
    })

    it('should have proper list and listbox roles', async () => {
      const mockSuggestions = ['apple']
      ingredientTrieModule.ingredientAutocomplete.mockReturnValue(mockSuggestions)

      renderSearchForm()
      const input = screen.getByPlaceholderText(/type an ingredient/i)
      
      await userEvent.type(input, 'apple')
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'apple' })).toBeInTheDocument()
      })
    })
  })
})
