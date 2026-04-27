import { describe, it, expect } from 'vitest'
import { parseIngredients } from '../../../src/utils/parseIngredients'

describe('parseIngredients()', () => {
  it('should trim whitespace from each ingredient', () => {
    const input = ['  apple  ', ' banana ', '   orange   ']
    const result = parseIngredients(input)
    expect(result).toEqual(['apple', 'banana', 'orange'])
  })

  it('should convert to lowercase for case-insensitive matching', () => {
    const input = ['APPLE', 'Banana', 'OrAnGe']
    const result = parseIngredients(input)
    expect(result).toEqual(['apple', 'banana', 'orange'])
  })

  it('should filter out empty strings', () => {
    const input = ['apple', '', 'banana', '   ', 'orange']
    const result = parseIngredients(input)
    expect(result).toEqual(['apple', 'banana', 'orange'])
  })

  it('should remove duplicate entries, keeping first occurrence', () => {
    const input = ['apple', 'banana', 'apple', 'orange', 'banana']
    const result = parseIngredients(input)
    expect(result).toEqual(['apple', 'banana', 'orange'])
  })

  it('should combine trim + lowercase + deduplicate', () => {
    const input = ['  APPLE  ', 'Banana', '  apple  ', 'ORANGE']
    const result = parseIngredients(input)
    expect(result).toEqual(['apple', 'banana', 'orange'])
  })

  it('should return empty array for empty input', () => {
    const input = []
    const result = parseIngredients(input)
    expect(result).toEqual([])
  })

  it('should return new array (not modify original)', () => {
    const input = ['apple', 'banana']
    const result = parseIngredients(input)
    expect(result).not.toBe(input)
    expect(input).toEqual(['apple', 'banana']) // original unchanged
  })

  it('should handle array with all empty/whitespace entries', () => {
    const input = ['', '   ', '\t', '  \n  ']
    const result = parseIngredients(input)
    expect(result).toEqual([])
  })

  it('should handle single element array', () => {
    const input = ['  APPLE  ']
    const result = parseIngredients(input)
    expect(result).toEqual(['apple'])
  })

  it('should handle complex real-world input', () => {
    const input = [
      '  OLIVE OIL  ',
      'garlic',
      'OLIVE OIL',
      '  ',
      'Garlic',
      'tomato',
      'salt',
      ''
    ]
    const result = parseIngredients(input)
    expect(result).toEqual(['olive oil', 'garlic', 'tomato', 'salt'])
  })
})
