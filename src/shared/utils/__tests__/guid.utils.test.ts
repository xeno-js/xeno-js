import { describe, expect, it } from 'vitest'

import { GuidHelper } from '@/shared'

const VALID_GUID = '550e8400-e29b-41d4-a716-446655440000'
const EMPTY_GUID = '00000000-0000-0000-0000-000000000000'

describe('GuidHelper', () => {
  describe('immutability', () => {
    it('GuidHelper is frozen', () => {
      expect(Object.isFrozen(GuidHelper)).toBe(true)
    })
  })

  // ─── generate ────────────────────────────────────────────────────────────────
  describe('generate', () => {
    it('returns a valid UUID v4', () => {
      const guid = GuidHelper.generate()
      expect(GuidHelper.isValid(guid)).toBe(true)
    })

    it('returns different values on successive calls', () => {
      const a = GuidHelper.generate()
      const b = GuidHelper.generate()
      expect(a).not.toBe(b)
    })

    it('returns a non-empty GUID', () => {
      const guid = GuidHelper.generate()
      expect(GuidHelper.isEmpty(guid)).toBe(false)
    })
  })

  // ─── isValid ─────────────────────────────────────────────────────────────────
  describe('isValid', () => {
    it('returns true for a valid UUID v4', () => {
      expect(GuidHelper.isValid(VALID_GUID)).toBe(true)
    })

    it('returns true for a freshly generated GUID', () => {
      expect(GuidHelper.isValid(GuidHelper.generate())).toBe(true)
    })

    it('returns false for an empty string', () => {
      expect(GuidHelper.isValid('')).toBe(false)
    })

    it('returns false for a random string', () => {
      expect(GuidHelper.isValid('not-a-guid')).toBe(false)
    })

    it('returns false for a UUID v1 (non-v4)', () => {
      expect(GuidHelper.isValid('550e8400-e29b-11d4-a716-446655440000')).toBe(false)
    })

    it('returns false for the empty GUID (version digit is 0, not 4)', () => {
      expect(GuidHelper.isValid(EMPTY_GUID)).toBe(false)
    })

    it('is case-insensitive', () => {
      expect(GuidHelper.isValid(VALID_GUID.toUpperCase())).toBe(true)
    })
  })

  // ─── isEmpty ─────────────────────────────────────────────────────────────────
  describe('isEmpty', () => {
    it('returns true for the empty GUID', () => {
      expect(GuidHelper.isEmpty(EMPTY_GUID)).toBe(true)
    })

    it('returns false for a valid non-empty GUID', () => {
      expect(GuidHelper.isEmpty(VALID_GUID)).toBe(false)
    })

    it('returns false for an arbitrary string', () => {
      expect(GuidHelper.isEmpty('hello')).toBe(false)
    })
  })

  // ─── isValidGuid ─────────────────────────────────────────────────────────────
  describe('isValidGuid', () => {
    it('returns true for a valid non-empty GUID', () => {
      expect(GuidHelper.isValidGuid(VALID_GUID)).toBe(true)
    })

    it('returns false for the empty GUID', () => {
      expect(GuidHelper.isValidGuid(EMPTY_GUID)).toBe(false)
    })

    it('returns false for a non-UUID string', () => {
      expect(
        GuidHelper.isValidGuid('not-a-guid' as `${string}-${string}-${string}-${string}-${string}`),
      ).toBe(false)
    })
  })

  // ─── parse ───────────────────────────────────────────────────────────────────
  describe('parse', () => {
    it('returns the GUID for a valid non-empty input', () => {
      expect(GuidHelper.parse(VALID_GUID)).toBe(VALID_GUID)
    })

    it('returns undefined for undefined input', () => {
      expect(GuidHelper.parse(undefined)).toBeUndefined()
    })

    it('returns undefined for null input', () => {
      expect(GuidHelper.parse(null as unknown as undefined)).toBeUndefined()
    })

    it('returns undefined for an empty string', () => {
      expect(GuidHelper.parse('')).toBeUndefined()
    })

    it('returns undefined for a non-UUID string', () => {
      expect(GuidHelper.parse('not-a-guid')).toBeUndefined()
    })

    it('returns undefined for the empty GUID', () => {
      expect(GuidHelper.parse(EMPTY_GUID)).toBeUndefined()
    })
  })
})
