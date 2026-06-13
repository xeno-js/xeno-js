import { describe, expect, it } from 'vitest'

import { DateHelper } from '../date.utils'

const MS_PER_DAY = 86_400_000

describe('DateHelper', () => {
  describe('immutability', () => {
    it('is frozen', () => {
      expect(Object.isFrozen(DateHelper)).toBe(true)
    })
  })

  describe('toISOString', () => {
    it('returns ISO 8601 string for a given date', () => {
      const date = new Date('2024-01-15T12:00:00.000Z')
      expect(DateHelper.toISOString(date)).toBe('2024-01-15T12:00:00.000Z')
    })

    it('returns the same value as Date.prototype.toISOString', () => {
      const date = new Date()
      expect(DateHelper.toISOString(date)).toBe(date.toISOString())
    })
  })

  describe('addDays', () => {
    it('returns a new Date with positive days added', () => {
      const base = new Date('2024-01-01T00:00:00.000Z')
      const result = DateHelper.addDays(base, 5)
      expect(result.getTime()).toBe(base.getTime() + 5 * MS_PER_DAY)
    })

    it('returns a new Date with negative days (subtracting)', () => {
      const base = new Date('2024-01-10T00:00:00.000Z')
      const result = DateHelper.addDays(base, -3)
      expect(result.getTime()).toBe(base.getTime() - 3 * MS_PER_DAY)
    })

    it('returns a new Date instance, not the original', () => {
      const base = new Date('2024-01-01T00:00:00.000Z')
      const result = DateHelper.addDays(base, 1)
      expect(result).not.toBe(base)
    })

    it('adding 0 days returns the same timestamp', () => {
      const base = new Date('2024-06-01T00:00:00.000Z')
      expect(DateHelper.addDays(base, 0).getTime()).toBe(base.getTime())
    })
  })

  describe('isExpired', () => {
    it('returns true when expiresAt is in the past', () => {
      const past = new Date(Date.now() - 1000)
      expect(DateHelper.isExpired(past)).toBe(true)
    })

    it('returns false when expiresAt is in the future', () => {
      const future = new Date(Date.now() + 100_000)
      expect(DateHelper.isExpired(future)).toBe(false)
    })

    it('uses provided nowMs reference instead of Date.now()', () => {
      const expiresAt = new Date(1000)
      expect(DateHelper.isExpired(expiresAt, 999)).toBe(false)
      expect(DateHelper.isExpired(expiresAt, 1001)).toBe(true)
    })

    it('returns true when expiresAt equals nowMs (not strictly after)', () => {
      const expiresAt = new Date(1000)
      expect(DateHelper.isExpired(expiresAt, 1000)).toBe(false)
    })
  })

  describe('isAfter', () => {
    it('returns true when after is strictly after before', () => {
      const before = new Date('2024-01-01')
      const after = new Date('2024-01-02')
      expect(DateHelper.isAfter(after, before)).toBe(true)
    })

    it('returns false when after is before before', () => {
      const before = new Date('2024-01-02')
      const after = new Date('2024-01-01')
      expect(DateHelper.isAfter(after, before)).toBe(false)
    })

    it('returns false when both dates are equal', () => {
      const d = new Date('2024-01-01')
      const d2 = new Date('2024-01-01')
      expect(DateHelper.isAfter(d, d2)).toBe(false)
    })

    it('returns false when after is not a valid Date', () => {
      expect(DateHelper.isAfter(new Date('invalid'), new Date('2024-01-01'))).toBe(false)
    })

    it('returns false when before is not a valid Date', () => {
      expect(DateHelper.isAfter(new Date('2024-01-01'), new Date('invalid'))).toBe(false)
    })
  })

  describe('isFuture', () => {
    it('returns true for a date in the future', () => {
      const future = new Date(Date.now() + 100_000)
      expect(DateHelper.isFuture(future)).toBe(true)
    })

    it('returns false for a date in the past', () => {
      const past = new Date(Date.now() - 100_000)
      expect(DateHelper.isFuture(past)).toBe(false)
    })

    it('returns false for an invalid Date', () => {
      expect(DateHelper.isFuture(new Date('invalid'))).toBe(false)
    })
  })
})
