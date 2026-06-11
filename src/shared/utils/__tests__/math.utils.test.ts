import { describe, expect, it } from 'vitest'

import { MathHelper } from '@/shared'

describe('MathHelper', () => {
  describe('immutability', () => {
    it('MathHelper is frozen', () => {
      expect(Object.isFrozen(MathHelper)).toBe(true)
    })
  })

  describe('clamp', () => {
    it('returns value when within range', () => {
      expect(MathHelper.clamp(5, 0, 10)).toBe(5)
    })

    it('returns min when value is below min', () => {
      expect(MathHelper.clamp(-5, 0, 10)).toBe(0)
    })

    it('returns max when value is above max', () => {
      expect(MathHelper.clamp(15, 0, 10)).toBe(10)
    })

    it('returns min when value equals min', () => {
      expect(MathHelper.clamp(0, 0, 10)).toBe(0)
    })

    it('returns max when value equals max', () => {
      expect(MathHelper.clamp(10, 0, 10)).toBe(10)
    })

    it('works with negative range', () => {
      expect(MathHelper.clamp(-3, -10, -1)).toBe(-3)
    })

    it('works when min equals max', () => {
      expect(MathHelper.clamp(7, 5, 5)).toBe(5)
    })
  })

  describe('roundTo', () => {
    it('rounds to 0 decimals', () => {
      expect(MathHelper.roundTo(3.7, 0)).toBe(4)
    })

    it('rounds to 2 decimals', () => {
      expect(MathHelper.roundTo(3.14159, 2)).toBe(3.14)
    })

    it('rounds up at midpoint', () => {
      expect(MathHelper.roundTo(1.005, 2)).toBeCloseTo(1.01, 1)
    })

    it('rounds negative values correctly', () => {
      expect(MathHelper.roundTo(-2.567, 2)).toBe(-2.57)
    })

    it('returns integer unchanged when decimals=0', () => {
      expect(MathHelper.roundTo(5, 0)).toBe(5)
    })

    it('handles large decimal precision', () => {
      expect(MathHelper.roundTo(1.123456789, 5)).toBe(1.12346)
    })
  })

  describe('safeDivide', () => {
    it('divides normally when denominator is non-zero', () => {
      expect(MathHelper.safeDivide(10, 2)).toBe(5)
    })

    it('returns default fallback (0) when denominator is zero', () => {
      expect(MathHelper.safeDivide(10, 0)).toBe(0)
    })

    it('returns custom fallback when denominator is zero', () => {
      expect(MathHelper.safeDivide(10, 0, -1)).toBe(-1)
    })

    it('handles negative numerator', () => {
      expect(MathHelper.safeDivide(-9, 3)).toBe(-3)
    })

    it('handles negative denominator', () => {
      expect(MathHelper.safeDivide(9, -3)).toBe(-3)
    })

    it('returns 0 when numerator is 0', () => {
      expect(MathHelper.safeDivide(0, 5)).toBe(0)
    })
  })

  describe('toPercentage', () => {
    it('returns correct percentage', () => {
      expect(MathHelper.toPercentage(25, 100)).toBe(25)
    })

    it('returns 0 when total is 0', () => {
      expect(MathHelper.toPercentage(10, 0)).toBe(0)
    })

    it('returns 100 when part equals total', () => {
      expect(MathHelper.toPercentage(5, 5)).toBe(100)
    })

    it('returns 0 when part is 0', () => {
      expect(MathHelper.toPercentage(0, 50)).toBe(0)
    })

    it('can exceed 100 when part > total', () => {
      expect(MathHelper.toPercentage(150, 100)).toBe(150)
    })

    it('works with decimal values', () => {
      expect(MathHelper.toPercentage(1, 3)).toBeCloseTo(33.333, 2)
    })
  })
})
