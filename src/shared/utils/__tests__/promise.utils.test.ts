import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PromiseHelper } from '@/shared'

describe('PromiseHelper', () => {
  describe('immutability', () => {
    it('PromiseHelper is frozen', () => {
      expect(Object.isFrozen(PromiseHelper)).toBe(true)
    })
  })

  describe('delay', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns a Promise', () => {
      const result = PromiseHelper.delay(100)
      expect(result).toBeInstanceOf(Promise)
      vi.runAllTimers()
    })

    it('resolves after the specified ms', async () => {
      const p = PromiseHelper.delay(500)
      vi.advanceTimersByTime(500)
      await expect(p).resolves.toBeUndefined()
    })

    it('does not resolve before the specified ms', async () => {
      let resolved = false
      const p = PromiseHelper.delay(1000).then(() => {
        resolved = true
      })
      vi.advanceTimersByTime(999)
      // flush microtasks without completing the timer
      await Promise.resolve()
      expect(resolved).toBe(false)
      vi.advanceTimersByTime(1)
      await p
      expect(resolved).toBe(true)
    })

    it('resolves immediately with 0 ms', async () => {
      const p = PromiseHelper.delay(0)
      vi.advanceTimersByTime(0)
      await expect(p).resolves.toBeUndefined()
    })
  })

  describe('delayWithJitter', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns a Promise', () => {
      const result = PromiseHelper.delayWithJitter(100, 50)
      expect(result).toBeInstanceOf(Promise)
      vi.runAllTimers()
    })

    it('resolves when baseDelay + maxJitter time has elapsed (jitter = maxJitterMs - 1)', async () => {
      // Force Math.random to return ~1 so jitter ≈ maxJitterMs - 1
      vi.spyOn(Math, 'random').mockReturnValue(0.999)
      const base = 200
      const maxJitter = 100
      const expectedJitter = Math.floor(0.999 * maxJitter) // 99
      const p = PromiseHelper.delayWithJitter(base, maxJitter)
      vi.advanceTimersByTime(base + expectedJitter)
      await expect(p).resolves.toBeUndefined()
      vi.restoreAllMocks()
    })

    it('resolves with zero jitter when Math.random returns 0', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const p = PromiseHelper.delayWithJitter(300, 200)
      vi.advanceTimersByTime(300) // jitter = 0
      await expect(p).resolves.toBeUndefined()
      vi.restoreAllMocks()
    })

    it('does not resolve before base + jitter elapsed', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      const base = 100
      const maxJitter = 100
      const jitter = Math.floor(0.5 * maxJitter) // 50
      let resolved = false
      const p = PromiseHelper.delayWithJitter(base, maxJitter).then(() => {
        resolved = true
      })
      vi.advanceTimersByTime(base + jitter - 1)
      await Promise.resolve()
      expect(resolved).toBe(false)
      vi.advanceTimersByTime(1)
      await p
      expect(resolved).toBe(true)
      vi.restoreAllMocks()
    })

    it('resolves with base=0 and maxJitter=0', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const p = PromiseHelper.delayWithJitter(0, 0)
      vi.advanceTimersByTime(0)
      await expect(p).resolves.toBeUndefined()
      vi.restoreAllMocks()
    })
  })
})
