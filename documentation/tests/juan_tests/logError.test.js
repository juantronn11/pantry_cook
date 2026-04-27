import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logError } from '../../../src/helperFunctions/logError'

describe('logError()', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('POSTs to /errors with the correct body fields', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true })

    await logError('Something broke', 'RecipeContext', 'user-123')

    expect(fetch).toHaveBeenCalledWith('/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Something broke',
        component: 'RecipeContext',
        userId: 'user-123',
      }),
    })
  })

  it('defaults component to "unknown" and userId to null when not provided', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true })

    await logError('Missing context')

    const body = JSON.parse(fetch.mock.calls[0][1].body)
    expect(body.component).toBe('unknown')
    expect(body.userId).toBeNull()
  })

  it('does not throw when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(logError('test', 'component')).resolves.toBeUndefined()
  })
})
