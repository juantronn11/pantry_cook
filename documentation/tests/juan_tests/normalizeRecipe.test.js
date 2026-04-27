import { describe, it, expect } from 'vitest'
import { normalizeSpoonacularRecipe } from '../../../src/utils/normalizeRecipe'

const mockRecipe = {
  id: 42,
  title: '  Spaghetti Carbonara  ',
  matchScore: 3,
  extendedIngredients: [{ name: 'eggs' }, { name: 'pancetta' }],
  instructions: 'Boil pasta. Mix eggs and cheese.',
}

describe('normalizeSpoonacularRecipe()', () => {
  it('returns an object with all required fields', () => {
    const result = normalizeSpoonacularRecipe(mockRecipe)

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('source')
    expect(result).toHaveProperty('matchScore')
    expect(result).toHaveProperty('raw')
  })

  it('prefixes id with "spoonacular-" using the raw recipe id', () => {
    const result = normalizeSpoonacularRecipe(mockRecipe)

    expect(result.id).toBe('spoonacular-42')
  })

  it('lowercases and trims the recipe title into name', () => {
    const result = normalizeSpoonacularRecipe(mockRecipe)

    expect(result.name).toBe('spaghetti carbonara')
  })

  it('sets source to "spoonacular"', () => {
    const result = normalizeSpoonacularRecipe(mockRecipe)

    expect(result.source).toBe('spoonacular')
  })

  it('defaults matchScore to 0 when not provided', () => {
    const { matchScore, ...recipeWithoutScore } = mockRecipe
    const result = normalizeSpoonacularRecipe(recipeWithoutScore)

    expect(result.matchScore).toBe(0)
  })

  it('passes the original recipe object through as raw', () => {
    const result = normalizeSpoonacularRecipe(mockRecipe)

    expect(result.raw).toBe(mockRecipe)
  })
})
