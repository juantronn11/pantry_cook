import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  ingredientAutocomplete,
  getAutocompleteCallCount,
  resetAutocompleteCallCount,
} from '../../../src/api/spoonacular.js'

function mockFetchOnce({ ok = true, status = 200, json = [] } = {}) {
  const fetchMock = vi.fn().mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve(json),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('spoonacular — ingredientAutocomplete', () => {
  beforeEach(() => {
    resetAutocompleteCallCount()
  })

  it('calls fetch with the autocomplete URL and the expected query params', async () => {
    const fetchMock = mockFetchOnce({ json: [] })

    await ingredientAutocomplete('chick')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const calledUrl = fetchMock.mock.calls[0][0]
    expect(calledUrl).toContain('/food/ingredients/autocomplete')
    expect(calledUrl).toContain('query=chick')
    expect(calledUrl).toContain('number=10')
    expect(calledUrl).toContain('language=en')
    expect(calledUrl).toContain('apiKey=')
  })

  it('URL-encodes the query string so multi-word input is safe', async () => {
    const fetchMock = mockFetchOnce({ json: [] })

    await ingredientAutocomplete('green onion')

    const calledUrl = fetchMock.mock.calls[0][0]
    expect(calledUrl).toContain('query=green%20onion')
  })

  it('returns the parsed JSON array from res.json() on success', async () => {
    const suggestions = [
      { name: 'chicken', image: 'chicken.jpg' },
      { name: 'chickpeas', image: 'chickpeas.jpg' },
    ]
    mockFetchOnce({ json: suggestions })

    const result = await ingredientAutocomplete('chick')

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ name: 'chicken', image: 'chicken.jpg' })
  })

  it('throws an Error whose message names the failed query on a non-OK response', async () => {
    mockFetchOnce({ ok: false, status: 429 })

    await expect(ingredientAutocomplete('chick')).rejects.toThrow(
      /Spoonacular autocomplete failed for "chick"/,
    )
  })
})

describe('spoonacular — autocomplete call counter', () => {
  beforeEach(() => {
    resetAutocompleteCallCount()
  })

  it('getAutocompleteCallCount() returns 0 after reset', () => {
    expect(getAutocompleteCallCount()).toBe(0)
    expect(typeof getAutocompleteCallCount()).toBe('number')
  })

  it('increments the counter by 1 on each successful call', async () => {
    mockFetchOnce({ json: [] })
    await ingredientAutocomplete('a')
    expect(getAutocompleteCallCount()).toBe(1)

    mockFetchOnce({ json: [] })
    await ingredientAutocomplete('b')
    expect(getAutocompleteCallCount()).toBe(2)
  })

  it('increments the counter even when the fetch fails (call was still made)', async () => {
    mockFetchOnce({ ok: false, status: 500 })
    await expect(ingredientAutocomplete('x')).rejects.toThrow()
    expect(getAutocompleteCallCount()).toBe(1)
  })

  it('resetAutocompleteCallCount() returns the counter back to 0', async () => {
    mockFetchOnce({ json: [] })
    await ingredientAutocomplete('a')
    mockFetchOnce({ json: [] })
    await ingredientAutocomplete('b')
    expect(getAutocompleteCallCount()).toBe(2)

    resetAutocompleteCallCount()
    expect(getAutocompleteCallCount()).toBe(0)
  })
})
