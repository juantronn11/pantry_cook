import { describe, it, expect, vi } from 'vitest'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'

let mockUseShoppingListContext = vi.fn()
vi.mock('../../../src/context/ShoppingListContext.jsx', () => ({
  useShoppingListContext: () => mockUseShoppingListContext(),
}))

import ShoppingListButton from '../../../src/components/ShoppingListButton/ShoppingListButton.jsx'

describe('ShoppingListButton', () => {
  it('calls addToShoppingList with the provided recipe when clicked', async () => {
    const recipe = { raw: { extendedIngredients: [{ name: 'tomato', amount: 1, unit: 'pc' }] } }
    const addToShoppingList = vi.fn(() => Promise.resolve())
    mockUseShoppingListContext.mockReturnValue({ addToShoppingList })

    render(<ShoppingListButton recipe={recipe} />)

    fireEvent.click(screen.getByRole('button', { name: /add to shopping list/i }))

    await waitFor(() => expect(addToShoppingList).toHaveBeenCalledWith(recipe))
  })

  it('changes button color to green on successful add and resets after 3 seconds', async () => {
    vi.useFakeTimers()
    const recipe = { raw: { extendedIngredients: [{ name: 'tomato', amount: 1, unit: 'pc' }] } }
    const addToShoppingList = vi.fn(() => Promise.resolve())
    mockUseShoppingListContext.mockReturnValue({ addToShoppingList })

    render(<ShoppingListButton recipe={recipe} />)
    const button = screen.getByRole('button', { name: /add to shopping list/i })

    await act(async () => {
      await fireEvent.click(button)
    })

    expect(button).toHaveStyle({ backgroundColor: 'rgb(0, 139, 12)' })

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(button).toHaveStyle({ backgroundColor: 'rgb(173, 216, 230)' })
  })

  it('shows a window.alert and logs an error when addToShoppingList rejects', async () => {
    const recipe = { raw: { extendedIngredients: [{ name: 'tomato', amount: 1, unit: 'pc' }] } }
    const addToShoppingList = vi.fn(() => Promise.reject(new Error('add failed')))
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    mockUseShoppingListContext.mockReturnValue({ addToShoppingList })

    render(<ShoppingListButton recipe={recipe} />)

    fireEvent.click(screen.getByRole('button', { name: /add to shopping list/i }))

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith(
      'There was an issue adding this recipe to your shopping list. Please try again.',
    ))
    expect(errorSpy).toHaveBeenCalled()
  })
})
