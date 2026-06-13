import { describe, expect, it } from 'vitest'

import { Result } from '@/domain'

describe('Result', () => {
  describe('ok', () => {
    it('creates a successful result and returns its value', () => {
      const result = Result.ok('value')

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toBe('value')
    })

    it('supports undefined as a valid success payload', () => {
      const result = Result.ok()

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toBeUndefined()
    })

    it('throws when requesting value from a failed result', () => {
      const result = Result.fail<string, string>('domain-error')

      expect(() => result.getValueOrThrow()).toThrowError(
        'Cannot get the value of a failed result.',
      )
    })

    it('supports complex objects as success payloads', () => {
      const payload = { id: '123', name: 'Alice' }
      const result = Result.ok(payload)

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toEqual(payload)
    })

    it('supports generic type parameters for value and error', () => {
      const result = Result.ok<number>(42)

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toBe(42)
    })

    it('supports null as a valid success payload', () => {
      const result = Result.ok(null)

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toBeNull()
    })
  })

  describe('fail', () => {
    it('creates a failed result and returns its error', () => {
      const error = new Error('failure')
      const result = Result.fail<string, Error>(error)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow()).toBe(error)
    })

    it('supports non-Error failure values', () => {
      const result = Result.fail<never, string>('domain-error')

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow()).toBe('domain-error')
    })

    it('throws when requesting value from a failed result', () => {
      const result = Result.fail<string, string>('domain-error')

      expect(() => result.getValueOrThrow()).toThrowError(
        'Cannot get the value of a failed result.',
      )
    })
  })

  describe('isOk', () => {
    it('returns true for successful results', () => {
      const result = Result.ok('value')
      expect(result.isOk()).toBe(true)
    })

    it('returns false for failed results', () => {
      const result = Result.fail<string, string>('domain-error')
      expect(result.isOk()).toBe(false)
    })

    it('returns true for successful results with undefined payload', () => {
      const result = Result.ok()
      expect(result.isOk()).toBe(true)
    })

    it('returns false for failed results with non-Error payload', () => {
      const result = Result.fail<never, string>('domain-error')
      expect(result.isOk()).toBe(false)
    })

    it('returns true for successful results with null payload', () => {
      const result = Result.ok(null)
      expect(result.isOk()).toBe(true)
    })
  })

  describe('getValueOrThrow', () => {
    it('returns the value for successful results', () => {
      const result = Result.ok('value')
      expect(result.getValueOrThrow()).toBe('value')
    })

    it('throws an error when called on a failed result', () => {
      const result = Result.fail<string, string>('domain-error')
      expect(() => result.getValueOrThrow()).toThrowError(
        'Cannot get the value of a failed result.',
      )
    })

    it('returns undefined for successful results with undefined payload', () => {
      const result = Result.ok()
      expect(result.getValueOrThrow()).toBeUndefined()
    })

    it('returns null for successful results with null payload', () => {
      const result = Result.ok(null)
      expect(result.getValueOrThrow()).toBeNull()
    })
  })

  describe('getErrorOrThrow', () => {
    it('returns the error for failed results', () => {
      const error = new Error('failure')
      const result = Result.fail<string, Error>(error)
      expect(result.getErrorOrThrow()).toBe(error)
    })

    it('throws an error when called on a successful result', () => {
      const result = Result.ok('value')
      expect(() => result.getErrorOrThrow()).toThrowError(
        'Cannot get the error of a successful result.',
      )
    })

    it('returns non-Error payloads for failed results', () => {
      const result = Result.fail<never, string>('domain-error')
      expect(result.getErrorOrThrow()).toBe('domain-error')
    })
  })
})
