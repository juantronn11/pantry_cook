import { describe, it, expect, vi } from 'vitest'
import { ingredientAutocomplete } from '../../../src/utils/ingredientTrie'

describe('ingredientTrie — Trie-based ingredient autocomplete', () => {
  // Note: The Trie is pre-built at module load with 3400+ ingredients.
  // We test the public API (ingredientAutocomplete) which uses the pre-built trie.

  describe('ingredientAutocomplete(query)', () => {
    it('should return matching ingredients for a valid prefix', () => {
      const result = ingredientAutocomplete('apple')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      // All results should start with "apple" (case-insensitive)
      result.forEach(ingredient => {
        expect(ingredient.toLowerCase().startsWith('apple')).toBe(true)
      })
    })

    it('should return case-insensitive matches', () => {
      const resultLower = ingredientAutocomplete('apple')
      const resultUpper = ingredientAutocomplete('APPLE')
      const resultMixed = ingredientAutocomplete('ApPlE')
      expect(resultLower).toEqual(resultUpper)
      expect(resultLower).toEqual(resultMixed)
    })

    it('should return up to 10 results by default', () => {
      // "a" is a common prefix with many matches
      const result = ingredientAutocomplete('a')
      expect(result.length).toBeLessThanOrEqual(10)
    })

    it('should return fewer results for queries with fewer matches', () => {
      // This should have fewer results since it's more specific
      const result = ingredientAutocomplete('zaatar')
      expect(result.length).toBeLessThanOrEqual(10)
      // zaatar is a real ingredient, should match
      expect(result).toContain('zaatar')
    })

    it('should return empty array for empty query', () => {
      const result = ingredientAutocomplete('')
      expect(result).toEqual([])
    })

    it('should return empty array for whitespace-only query', () => {
      const result1 = ingredientAutocomplete('   ')
      const result2 = ingredientAutocomplete('\t')
      const result3 = ingredientAutocomplete('\n')
      expect(result1).toEqual([])
      expect(result2).toEqual([])
      expect(result3).toEqual([])
    })

    it('should return empty array for non-matching prefix', () => {
      // "zzz" is unlikely to be a real ingredient prefix
      const result = ingredientAutocomplete('zzz')
      expect(result).toEqual([])
    })

    it('should match only prefix, not substring', () => {
      // "all" should match "almond", "all bran", etc., but not "ball"
      const result = ingredientAutocomplete('all')
      expect(result.length).toBeGreaterThan(0)
      // All results should start with "all"
      result.forEach(ingredient => {
        expect(ingredient.toLowerCase().startsWith('all')).toBe(true)
      })
      // Ensure no substring matches like "ball" or "call" or "tall"
      result.forEach(ingredient => {
        expect(ingredient.toLowerCase()).not.toMatch(/^[^a][^l]*all/)
      })
    })

    it('should trim input query before searching', () => {
      const result1 = ingredientAutocomplete('apple')
      const result2 = ingredientAutocomplete('  apple  ')
      expect(result1).toEqual(result2)
    })

    it('should return strings only', () => {
      const result = ingredientAutocomplete('apple')
      result.forEach(ingredient => {
        expect(typeof ingredient).toBe('string')
      })
    })

    it('should return valid ingredients from the pre-loaded list', () => {
      const result = ingredientAutocomplete('corn')
      expect(result.length).toBeGreaterThan(0)
      // Common corn-based ingredients should be in results
      const hasCommonCornIngredient = result.some(ing =>
        ['corn', 'corn starch', 'corn flour'].includes(ing.toLowerCase())
      )
      expect(hasCommonCornIngredient).toBe(true)
    })

    it('should handle multi-character prefixes', () => {
      const result = ingredientAutocomplete('bak')
      expect(result.length).toBeGreaterThan(0)
      result.forEach(ingredient => {
        expect(ingredient.toLowerCase().startsWith('bak')).toBe(true)
      })
    })

    it('should be deterministic for the same query', () => {
      const result1 = ingredientAutocomplete('olive')
      const result2 = ingredientAutocomplete('olive')
      expect(result1).toEqual(result2)
    })

    it('should handle special characters or numbers in ingredient names', () => {
      // Some ingredients may have numbers (e.g., "1 percent milk")
      const result = ingredientAutocomplete('1')
      expect(Array.isArray(result)).toBe(true)
      // Should match ingredients starting with "1"
      result.forEach(ingredient => {
        expect(ingredient.startsWith('1')).toBe(true)
      })
    })
  })
})
