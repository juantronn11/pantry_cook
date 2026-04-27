import { describe, it, expect, vi } from 'vitest'
import { withTimeout } from '../../../src/utils/withTimeout.js'

describe('withTimeout', () => {
  it('returns a Promise', () => {
    const result = withTimeout(Promise.resolve('ok'), 1000)
    expect(result).toBeInstanceOf(Promise)
    return result
  })

  it('resolves with the inner promise value when it settles before the timeout', async () => {
    const sentinel = { id: 42 }
    const result = await withTimeout(Promise.resolve(sentinel), 1000)
    expect(result).toBe(sentinel)
  })

  it('forwards the rejection reason when the inner promise rejects before the timeout', async () => {
    const boom = new Error('upstream failure')
    await expect(withTimeout(Promise.reject(boom), 1000)).rejects.toBe(boom)
  })

  it('rejects with an Error after ms elapses when the inner promise never settles', async () => {
    vi.useFakeTimers()
    const neverSettles = new Promise(() => {})
    const pending = withTimeout(neverSettles, 30000)

    const rejection = expect(pending).rejects.toThrow(Error)
    await vi.advanceTimersByTimeAsync(30000)
    await rejection
  })

  it('timeout Error has the documented message containing the timeout in seconds', async () => {
    vi.useFakeTimers()
    const neverSettles = new Promise(() => {})
    const pending = withTimeout(neverSettles, 30000)

    const rejection = expect(pending).rejects.toThrow(
      /Request timed out after 30 seconds/,
    )
    await vi.advanceTimersByTimeAsync(30000)
    await rejection
  })

  it('does not reject early — before ms elapses, the promise is still pending', async () => {
    vi.useFakeTimers()
    let settled = false
    const neverSettles = new Promise(() => {})
    const pending = withTimeout(neverSettles, 30000).catch(() => {
      settled = true
    })

    await vi.advanceTimersByTimeAsync(29999)
    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await pending
    expect(settled).toBe(true)
  })
})
