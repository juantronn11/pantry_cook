import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

let mockUseShoppingListContext = vi.fn()
vi.mock('../../../src/context/ShoppingListContext.jsx', () => ({
  useShoppingListContext: () => mockUseShoppingListContext(),
}))

import ShoppingList from '../../../src/components/ShoppingList/ShoppingList.jsx'

describe('ShoppingList', () => {
  it('calls addCustomItem when a new item is entered and the add button is clicked', () => {
    const addCustomItem = vi.fn()
    mockUseShoppingListContext.mockReturnValue({
      shoppingList: [],
      addCustomItem,
      removeFromShoppingList: vi.fn(),
      clearShoppingList: vi.fn(),
      toggleShoppingListItem: vi.fn(),
    })

    render(<ShoppingList />)

    fireEvent.change(screen.getByPlaceholderText(/add item/i), {
      target: { value: 'paper towels' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add/i }))

    expect(addCustomItem).toHaveBeenCalledWith('paper towels')
  })

  it('calls removeFromShoppingList when an item remove button is clicked', () => {
    const removeFromShoppingList = vi.fn()
    mockUseShoppingListContext.mockReturnValue({
      shoppingList: [
        { id: 'item-1', name: 'paper towels', amount: 0, unit: '', checked: false },
      ],
      addCustomItem: vi.fn(),
      removeFromShoppingList,
      clearShoppingList: vi.fn(),
      toggleShoppingListItem: vi.fn(),
    })

    render(<ShoppingList />)

    fireEvent.click(screen.getByRole('button', { name: 'x' }))

    expect(removeFromShoppingList).toHaveBeenCalledWith('item-1')
  })

  it('calls clearShoppingList when the clear list button is clicked', () => {
    const clearShoppingList = vi.fn()
    mockUseShoppingListContext.mockReturnValue({
      shoppingList: [
        { id: 'item-1', name: 'milk', amount: 1, unit: 'cup', checked: false },
      ],
      addCustomItem: vi.fn(),
      removeFromShoppingList: vi.fn(),
      clearShoppingList,
      toggleShoppingListItem: vi.fn(),
    })

    render(<ShoppingList />)

    fireEvent.click(screen.getByRole('button', { name: /clear list/i }))

    expect(clearShoppingList).toHaveBeenCalledTimes(1)
  })
})
