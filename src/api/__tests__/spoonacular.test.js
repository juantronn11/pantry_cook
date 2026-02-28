// Unit tests for Spoonacular API service (src/api/spoonacular.js)
// All fetch calls are mocked — no real API requests are made.
// Timer mocks are used so batchGetDetails' setTimeout delays resolve instantly.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchSpoonacularRecipes } from '../spoonacular'

// Mock environment variable so the module can build URLs
vi.stubEnv('VITE_SPOONACULAR_API_KEY', 'test-key')

beforeEach(() => {
  vi.restoreAllMocks()
  vi.useFakeTimers()
})

// Helper: creates a mock search result (what findByIngredients returns)
function mockSearchResult(id, title) {
  return { id, title, image: `img${id}.jpg` }
}

// Helper: creates a mock detail result (what /recipes/{id}/information returns)
function mockDetailResult(id, title) {
  return { id, title, image: `img${id}.jpg`, instructions: `Cook ${title}` }
}

describe('fetchSpoonacularRecipes', () => {

  it('returns recipe details for matching recipes', async () => {
    const searchResults = [mockSearchResult(1, 'Pasta'), mockSearchResult(2, 'Salad')]

    global.fetch = vi.fn()
      // First call: ingredient search
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(searchResults),
      })
      // Detail fetch for recipe 1
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetailResult(1, 'Pasta')),
      })
      // Detail fetch for recipe 2
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetailResult(2, 'Salad')),
      })

    // Run the function and advance fake timers so setTimeout resolves
    const promise = fetchSpoonacularRecipes(['tomato'])
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('Pasta')
    expect(result[1].title).toBe('Salad')
  })

  it('deduplicates recipes that appear in multiple ingredient searches', async () => {
    // Both "tomato" and "cheese" return recipe id 1
    const searchResults = [mockSearchResult(1, 'Pizza'), mockSearchResult(2, 'Bruschetta')]

    global.fetch = vi.fn()
      // Search for "tomato"
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(searchResults),
      })
      // Search for "cheese" — returns the same pizza (id 1) plus a new one
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockSearchResult(1, 'Pizza'), mockSearchResult(3, 'Mac and Cheese')]),
      })
      // Detail fetches for unique recipes: 1, 2, 3
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetailResult(1, 'Pizza')),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetailResult(2, 'Bruschetta')),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetailResult(3, 'Mac and Cheese')),
      })

    const promise = fetchSpoonacularRecipes(['tomato', 'cheese'])
    await vi.runAllTimersAsync()
    const result = await promise

    // 3 unique recipes (ids 1, 2, 3) — Pizza (id 1) appears only once
    // despite being in both search results
    expect(result).toHaveLength(3)
    const pizzaCount = result.filter(r => r.title === 'Pizza').length
    expect(pizzaCount).toBe(1)
  })

  it('handles partial failures — returns recipes that succeeded', async () => {
    const searchResults = [mockSearchResult(1, 'Pasta'), mockSearchResult(2, 'Salad')]

    global.fetch = vi.fn()
      // Ingredient search succeeds
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(searchResults),
      })
      // Detail fetch for recipe 1 succeeds
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetailResult(1, 'Pasta')),
      })
      // Detail fetch for recipe 2 fails
      .mockResolvedValueOnce({ ok: false, status: 429 })

    const promise = fetchSpoonacularRecipes(['tomato'])
    await vi.runAllTimersAsync()
    const result = await promise

    // Only recipe 1 should come through since recipe 2's detail fetch failed
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Pasta')
  })

  it('returns empty array when ingredient search finds nothing', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })

    const promise = fetchSpoonacularRecipes(['xyznonexistent'])
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result).toEqual([])
  })

  it('returns empty array when all ingredient searches fail', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 })

    const promise = fetchSpoonacularRecipes(['tomato'])
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result).toEqual([])
  })

  it('fires detail fetches in batches of 3', async () => {
    // 5 unique recipes — should fire in 2 batches: [3, 2]
    const searchResults = [
      mockSearchResult(1, 'A'), mockSearchResult(2, 'B'),
      mockSearchResult(3, 'C'), mockSearchResult(4, 'D'),
      mockSearchResult(5, 'E'),
    ]

    global.fetch = vi.fn()
      // Ingredient search
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(searchResults),
      })
      // All 5 detail fetches succeed
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDetailResult(1, 'A')),
      })

    const promise = fetchSpoonacularRecipes(['tomato'])
    await vi.runAllTimersAsync()
    await promise

    // 1 search call + 5 detail calls = 6 total fetch calls
    expect(global.fetch).toHaveBeenCalledTimes(6)
  })
})
