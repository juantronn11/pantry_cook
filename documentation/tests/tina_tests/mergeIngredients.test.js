import { describe, it, expect } from 'vitest'
import { mergeIngredients } from '../../../src/utils/mergeIngredients.js'

describe('mergeIngredients', () => {
  it('merges ingredients with the same name and unit by adding amounts', () => {
    const existingList = [
      { id: '1', name: 'sugar', amount: 2, unit: 'cup', checked: false },
    ]
    const newIngredients = [{ name: 'Sugar', amount: 1, unit: 'cup' }]

    const result = mergeIngredients(existingList, newIngredients)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(
      expect.objectContaining({ name: 'sugar', amount: 3, unit: 'cup', checked: false }),
    )
  })

  it('keeps ingredients with the same name but different units separate', () => {
    const existingList = [
      { id: '1', name: 'flour', amount: 1, unit: 'cup', checked: false },
    ]
    const newIngredients = [{ name: 'flour', amount: 100, unit: 'g' }]

    const result = mergeIngredients(existingList, newIngredients)

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'flour', amount: 1, unit: 'cup' }),
        expect.objectContaining({ name: 'flour', amount: 100, unit: 'g' }),
      ]),
    )
  })

  it('normalizes ingredient names to lowercase and preserves units', () => {
    const existingList = []
    const newIngredients = [{ name: '  OIL  ', amount: 2, unit: 'tbsp' }]

    const result = mergeIngredients(existingList, newIngredients)

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('oil')
    expect(result[0].unit).toBe('tbsp')
  })

  it('ignores new ingredients with missing or empty names', () => {
    const existingList = [{ id: '1', name: 'salt', amount: 1, unit: 'tsp', checked: false }]
    const newIngredients = [{ name: '   ', amount: 2, unit: 'tsp' }, { amount: 3, unit: 'cup' }]

    const result = mergeIngredients(existingList, newIngredients)

    expect(result).toEqual(existingList)
  })
})
