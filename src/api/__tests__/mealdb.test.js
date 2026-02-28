// Unit tests for MealDB API service (src/api/mealdb.js)
// All fetch calls are mocked — no real API requests are made.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchMealDBRecipes } from '../mealdb'

// Mock the VITE_MEALDB_BASE_URL environment variable so the module
// can build its fetch URLs without a real .env file
vi.stubEnv('VITE_MEALDB_BASE_URL', 'https://www.themealdb.com/api/json/v1/1')

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('fetchMealDBRecipes', () => {

  it('returns meals that match a single ingredient', async () => {
    // Simulate the API returning two chicken meals
    const mockMeals = [
      { idMeal: '1', strMeal: 'Chicken Curry', strMealThumb: 'img1.jpg' },
      { idMeal: '2', strMeal: 'Chicken Soup', strMealThumb: 'img2.jpg' },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ meals: mockMeals }),
    })

    const result = await fetchMealDBRecipes(['chicken'])

    // Should return both meals since there's only one ingredient
    expect(result).toHaveLength(2)
    expect(result[0].strMeal).toBe('Chicken Curry')
    expect(result[1].strMeal).toBe('Chicken Soup')
  })

  it('returns only meals that match ALL ingredients (intersection)', async () => {
    // "chicken" returns meals 1, 2, 3
    const chickenMeals = [
      { idMeal: '1', strMeal: 'Chicken Curry', strMealThumb: 'img1.jpg' },
      { idMeal: '2', strMeal: 'Chicken Soup', strMealThumb: 'img2.jpg' },
      { idMeal: '3', strMeal: 'Chicken Rice', strMealThumb: 'img3.jpg' },
    ]
    // "rice" returns meals 3, 4 — only meal 3 overlaps with chicken
    const riceMeals = [
      { idMeal: '3', strMeal: 'Chicken Rice', strMealThumb: 'img3.jpg' },
      { idMeal: '4', strMeal: 'Fried Rice', strMealThumb: 'img4.jpg' },
    ]

    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ meals: chickenMeals }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ meals: riceMeals }) })

    const result = await fetchMealDBRecipes(['chicken', 'rice'])

    // Only Chicken Rice (id 3) appears in BOTH ingredient results
    expect(result).toHaveLength(1)
    expect(result[0].idMeal).toBe('3')
    expect(result[0].strMeal).toBe('Chicken Rice')
  })

  it('returns empty array when API returns no meals', async () => {
    // MealDB returns { meals: null } when no recipes match
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ meals: null }),
    })

    const result = await fetchMealDBRecipes(['xyznonexistent'])
    expect(result).toEqual([])
  })

  it('returns empty array when all ingredient searches fail', async () => {
    // Simulate a network error on every fetch call
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 })

    const result = await fetchMealDBRecipes(['chicken', 'rice'])
    expect(result).toEqual([])
  })

  it('fires one fetch call per ingredient', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ meals: [] }),
    })

    await fetchMealDBRecipes(['chicken', 'rice', 'tomato'])

    // Three ingredients = three fetch calls, all fired concurrently
    expect(global.fetch).toHaveBeenCalledTimes(3)
  })
})
