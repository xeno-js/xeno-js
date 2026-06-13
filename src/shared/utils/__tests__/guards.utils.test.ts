import { describe, expect, it, vi } from 'vitest'

import { Guards } from '@/shared'

describe('Guards', () => {
  describe('immutability', () => {
    it('Guards is frozen', () => {
      expect(Object.isFrozen(Guards)).toBe(true)
    })
  })

  // ─── isDefined ───────────────────────────────────────────────────────────────
  describe('isDefined', () => {
    it('returns true for a non-empty string', () => {
      expect(Guards.isDefined('hello')).toBe(true)
    })
    it('returns true for a number', () => {
      expect(Guards.isDefined(42)).toBe(true)
    })
    it('returns true for an object', () => {
      expect(Guards.isDefined({})).toBe(true)
    })
    it('returns true for true', () => {
      expect(Guards.isDefined(true)).toBe(true)
    })
    it('returns false for null', () => {
      expect(Guards.isDefined(null)).toBe(false)
    })
    it('returns false for undefined', () => {
      expect(Guards.isDefined(undefined)).toBe(false)
    })
    it('returns false for empty string', () => {
      expect(Guards.isDefined('')).toBe(false)
    })
    it('returns true for false', () => {
      expect(Guards.isDefined(false)).toBe(true)
    })
    it('returns true for 0', () => {
      expect(Guards.isDefined(0)).toBe(true)
    })
    it('returns false for NaN', () => {
      expect(Guards.isDefined(NaN)).toBe(false)
    })
    it('returns true for empty array', () => {
      expect(Guards.isDefined([])).toBe(true)
    })
  })

  // ─── isNullOrEmpty ───────────────────────────────────────────────────────────
  describe('isNullOrEmpty', () => {
    it('returns true for null', () => {
      expect(Guards.isNullOrEmpty(null)).toBe(true)
    })
    it('returns true for undefined', () => {
      expect(Guards.isNullOrEmpty(undefined)).toBe(true)
    })
    it('returns true for empty string', () => {
      expect(Guards.isNullOrEmpty('')).toBe(true)
    })
    it('returns true for whitespace-only string', () => {
      expect(Guards.isNullOrEmpty('   ')).toBe(true)
    })
    it('returns true for empty array', () => {
      expect(Guards.isNullOrEmpty([])).toBe(true)
    })
    it('returns false for a non-empty string', () => {
      expect(Guards.isNullOrEmpty('hello')).toBe(false)
    })
    it('returns false for a non-empty array', () => {
      expect(Guards.isNullOrEmpty([1, 2])).toBe(false)
    })
    it('returns false for a number', () => {
      expect(Guards.isNullOrEmpty(42)).toBe(false)
    })
    it('returns false for an object', () => {
      expect(Guards.isNullOrEmpty({})).toBe(false)
    })
    it('returns false for true', () => {
      expect(Guards.isNullOrEmpty(true)).toBe(false)
    })
    it('returns false for false', () => {
      expect(Guards.isNullOrEmpty(false)).toBe(false)
    })
  })

  // ─── throwIfNullOrEmpty ──────────────────────────────────────────────────────
  describe('throwIfNullOrEmpty', () => {
    it('does not throw for a valid value', () => {
      expect(() => Guards.throwIfNullOrEmpty('value', 'err')).not.toThrow()
    })
    it('throws for null', () => {
      expect(() => Guards.throwIfNullOrEmpty(null, 'null error')).toThrow('null error')
    })
    it('throws for undefined', () => {
      expect(() => Guards.throwIfNullOrEmpty(undefined, 'undef error')).toThrow('undef error')
    })
    it('throws for empty string', () => {
      expect(() => Guards.throwIfNullOrEmpty('', 'empty')).toThrow('empty')
    })
  })

  // ─── throwIfNegative ─────────────────────────────────────────────────────────
  describe('throwIfNegative', () => {
    it('does not throw for a positive integer', () => {
      expect(() => Guards.throwIfNegative(5, 'err')).not.toThrow()
    })
    it('does not throw for zero', () => {
      expect(() => Guards.throwIfNegative(0, 'err')).not.toThrow()
    })
    it('throws for a negative integer', () => {
      expect(() => Guards.throwIfNegative(-1, 'negative')).toThrow('negative')
    })
    it('does not throw for a float (not integer)', () => {
      expect(() => Guards.throwIfNegative(-1.5, 'err')).not.toThrow()
    })
  })

  // ─── throwIfNotInteger ───────────────────────────────────────────────────────
  describe('throwIfNotInteger', () => {
    it('does not throw for an integer', () => {
      expect(() => Guards.throwIfNotInteger(3, 'err')).not.toThrow()
    })
    it('throws for a float', () => {
      expect(() => Guards.throwIfNotInteger(3.14, 'not int')).toThrow('not int')
    })
    it('throws for NaN', () => {
      expect(() => Guards.throwIfNotInteger(NaN, 'nan')).toThrow('nan')
    })
  })

  // ─── hasMethod ───────────────────────────────────────────────────────────────
  describe('hasMethod', () => {
    it('returns true when obj has the named method', () => {
      expect(Guards.hasMethod({ greet: () => 'hi' }, 'greet')).toBe(true)
    })
    it('returns false when obj does not have the method', () => {
      expect(Guards.hasMethod({}, 'missing')).toBe(false)
    })
    it('returns false when obj is null', () => {
      expect(Guards.hasMethod(null, 'method')).toBe(false)
    })
    it('returns false when property exists but is not a function', () => {
      expect(Guards.hasMethod({ foo: 'bar' }, 'foo')).toBe(false)
    })
  })

  // ─── isString ────────────────────────────────────────────────────────────────
  describe('isString', () => {
    it('returns true for a string', () => {
      expect(Guards.isString('hello')).toBe(true)
    })
    it('returns false for a number', () => {
      expect(Guards.isString(1)).toBe(false)
    })
    it('returns false for null', () => {
      expect(Guards.isString(null)).toBe(false)
    })
  })

  // ─── isNumber ────────────────────────────────────────────────────────────────
  describe('isNumber', () => {
    it('returns true for a finite number', () => {
      expect(Guards.isNumber(3.14)).toBe(true)
    })
    it('returns false for Infinity', () => {
      expect(Guards.isNumber(Infinity)).toBe(false)
    })
    it('returns false for NaN', () => {
      expect(Guards.isNumber(NaN)).toBe(false)
    })
    it('returns false for a string', () => {
      expect(Guards.isNumber('3')).toBe(false)
    })
  })

  // ─── isInteger ───────────────────────────────────────────────────────────────
  describe('isInteger', () => {
    it('returns true for an integer', () => {
      expect(Guards.isInteger(7)).toBe(true)
    })
    it('returns false for a float', () => {
      expect(Guards.isInteger(7.5)).toBe(false)
    })
    it('returns false for NaN', () => {
      expect(Guards.isInteger(NaN)).toBe(false)
    })
    it('returns false for Infinity', () => {
      expect(Guards.isInteger(Infinity)).toBe(false)
    })
  })

  // ─── isBoolean ───────────────────────────────────────────────────────────────
  describe('isBoolean', () => {
    it('returns true for true', () => {
      expect(Guards.isBoolean(true)).toBe(true)
    })
    it('returns true for false', () => {
      expect(Guards.isBoolean(false)).toBe(true)
    })
    it('returns false for 1', () => {
      expect(Guards.isBoolean(1)).toBe(false)
    })
  })

  // ─── isBigInt ────────────────────────────────────────────────────────────────
  describe('isBigInt', () => {
    it('returns true for a bigint', () => {
      expect(Guards.isBigInt(BigInt(42))).toBe(true)
    })
    it('returns false for a number', () => {
      expect(Guards.isBigInt(42)).toBe(false)
    })
  })

  // ─── isSymbol ────────────────────────────────────────────────────────────────
  describe('isSymbol', () => {
    it('returns true for a symbol', () => {
      expect(Guards.isSymbol(Symbol('s'))).toBe(true)
    })
    it('returns false for a string', () => {
      expect(Guards.isSymbol('s')).toBe(false)
    })
  })

  // ─── isFunction ──────────────────────────────────────────────────────────────
  describe('isFunction', () => {
    it('returns true for a function', () => {
      expect(Guards.isFunction(vi.fn())).toBe(true)
    })
    it('returns false for an object', () => {
      expect(Guards.isFunction({})).toBe(false)
    })
  })

  // ─── isArray ─────────────────────────────────────────────────────────────────
  describe('isArray', () => {
    it('returns true for an array', () => {
      expect(Guards.isArray([1, 2])).toBe(true)
    })
    it('returns false for an object', () => {
      expect(Guards.isArray({})).toBe(false)
    })
    it('returns false for null', () => {
      expect(Guards.isArray(null)).toBe(false)
    })
  })

  // ─── isDate ──────────────────────────────────────────────────────────────────
  describe('isDate', () => {
    it('returns true for a valid Date', () => {
      expect(Guards.isDate(new Date())).toBe(true)
    })
    it('returns false for an invalid Date', () => {
      expect(Guards.isDate(new Date('invalid'))).toBe(false)
    })
    it('returns false for a string', () => {
      expect(Guards.isDate('2024-01-01')).toBe(false)
    })
    it('returns false for a number', () => {
      expect(Guards.isDate(0)).toBe(false)
    })
  })

  // ─── isError ─────────────────────────────────────────────────────────────────
  describe('isError', () => {
    it('returns true for an Error instance', () => {
      expect(Guards.isError(new Error('oops'))).toBe(true)
    })
    it('returns false for a plain object', () => {
      expect(Guards.isError({ message: 'oops' })).toBe(false)
    })
  })

  // ─── isObjectRecord ──────────────────────────────────────────────────────────
  describe('isObjectRecord', () => {
    it('returns true for a plain object', () => {
      expect(Guards.isObjectRecord({ a: 1 })).toBe(true)
    })
    it('returns false for an array', () => {
      expect(Guards.isObjectRecord([1, 2])).toBe(false)
    })
    it('returns false for null', () => {
      expect(Guards.isObjectRecord(null)).toBe(false)
    })
    it('returns false for a Date', () => {
      expect(Guards.isObjectRecord(new Date())).toBe(false)
    })
    it('returns false for undefined', () => {
      expect(Guards.isObjectRecord(undefined)).toBe(false)
    })
  })

  // ─── isObject ────────────────────────────────────────────────────────────────
  describe('isObject', () => {
    it('returns true for a plain object', () => {
      expect(Guards.isObject({})).toBe(true)
    })
    it('returns true for an array', () => {
      expect(Guards.isObject([])).toBe(true)
    })
    it('returns false for null', () => {
      expect(Guards.isObject(null)).toBe(false)
    })
    it('returns false for a string', () => {
      expect(Guards.isObject('hello')).toBe(false)
    })
  })

  // ─── isPromiseLike ───────────────────────────────────────────────────────────
  describe('isPromiseLike', () => {
    it('returns true for a native Promise', () => {
      expect(Guards.isPromiseLike(Promise.resolve())).toBe(true)
    })
    it('returns true for a thenable object', () => {
      expect(Guards.isPromiseLike({ then: vi.fn() })).toBe(true)
    })
    it('returns false for a plain object without then', () => {
      expect(Guards.isPromiseLike({ foo: 1 })).toBe(false)
    })
    it('returns false for null', () => {
      expect(Guards.isPromiseLike(null)).toBe(false)
    })
    it('returns false for a string', () => {
      expect(Guards.isPromiseLike('hello')).toBe(false)
    })
    it('returns true for a function with then', () => {
      const fn = vi.fn()
      ;(fn as unknown as Record<string, unknown>)['then'] = vi.fn()
      expect(Guards.isPromiseLike(fn)).toBe(true)
    })
    it('returns false when then is not a function', () => {
      expect(Guards.isPromiseLike({ then: 'not-a-fn' })).toBe(false)
    })
    it('returns false for undefined', () => {
      expect(Guards.isPromiseLike(undefined)).toBe(false)
    })
    it('returns false for a number', () => {
      expect(Guards.isPromiseLike(42)).toBe(false)
    })
    it('returns false for a boolean', () => {
      expect(Guards.isPromiseLike(true)).toBe(false)
    })
  })
})
