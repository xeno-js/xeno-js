import { describe, expect, it } from 'vitest'

import { Specification } from '../specification'

// 1. Creiamo delle implementazioni concrete per i test
class IsEvenSpecification extends Specification<number> {
  public isSatisfiedBy(candidate: number): boolean {
    return candidate % 2 === 0
  }
}

class IsPositiveSpecification extends Specification<number> {
  public isSatisfiedBy(candidate: number): boolean {
    return candidate > 0
  }
}

describe('Specification Pattern', () => {
  const isEven = new IsEvenSpecification()
  const isPositive = new IsPositiveSpecification()

  describe('Logical AND', () => {
    it('should return true if both specifications are satisfied', () => {
      const spec = isEven.and(isPositive)
      expect(spec.isSatisfiedBy(4)).toBe(true) // Pari e Positivo
    })

    it('should return false if one specification fails', () => {
      const spec = isEven.and(isPositive)
      expect(spec.isSatisfiedBy(3)).toBe(false) // Dispari, Positivo
      expect(spec.isSatisfiedBy(-2)).toBe(false) // Pari, Negativo
    })
  })

  describe('Logical OR', () => {
    it('should return true if at least one specification is satisfied', () => {
      const spec = isEven.or(isPositive)
      expect(spec.isSatisfiedBy(4)).toBe(true) // Pari (True)
      expect(spec.isSatisfiedBy(3)).toBe(true) // Positivo (True)
    })

    it('should return false if both specifications fail', () => {
      const spec = isEven.or(isPositive)
      expect(spec.isSatisfiedBy(-3)).toBe(false) // Dispari e Negativo
    })
  })

  describe('Logical NOT', () => {
    it('should invert the result of the specification', () => {
      const spec = isEven.not()
      expect(spec.isSatisfiedBy(4)).toBe(false) // Non Pari
      expect(spec.isSatisfiedBy(3)).toBe(true) // Non Dispari (quindi Pari? no, 3 non è pari)
    })
  })

  describe('Complex Combinations', () => {
    it('should support chaining operations (e.g., NOT (A AND B))', () => {
      // (Even AND Positive) NOT => Equivalent to (Odd OR Negative)
      const spec = isEven.and(isPositive).not()

      expect(spec.isSatisfiedBy(4)).toBe(false) // (True AND True) NOT = False
      expect(spec.isSatisfiedBy(3)).toBe(true) // (False AND True) NOT = True
      expect(spec.isSatisfiedBy(-2)).toBe(true) // (True AND False) NOT = True
    })
  })
})
