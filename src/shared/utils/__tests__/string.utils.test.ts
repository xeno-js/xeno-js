import { describe, expect, it } from 'vitest'

import { StringHelper } from '@/shared'

describe('StringHelper', () => {
  describe('immutability', () => {
    it('StringHelper is frozen', () => {
      expect(Object.isFrozen(StringHelper)).toBe(true)
    })
  })

  // ─── safeStringify ───────────────────────────────────────────────────────────
  describe('safeStringify', () => {
    it('stringifies a plain object', () => {
      expect(StringHelper.safeStringify({ a: 1 })).toBe('{"a":1}')
    })

    it('stringifies a number', () => {
      expect(StringHelper.safeStringify(42)).toBe('42')
    })

    it('stringifies null', () => {
      expect(StringHelper.safeStringify(null)).toBe('null')
    })

    it('stringifies an array', () => {
      expect(StringHelper.safeStringify([1, 2])).toBe('[1,2]')
    })

    it('falls back to String() for circular references', () => {
      const obj: Record<string, unknown> = {}
      obj['self'] = obj
      const result = StringHelper.safeStringify(obj)
      expect(typeof result).toBe('string')
      expect(result).toBe('[object Object]')
    })
  })

  // ─── safeParse ───────────────────────────────────────────────────────────────
  describe('safeParse', () => {
    it('parses a valid JSON string', () => {
      expect(StringHelper.safeParse<{ a: number }>('{"a":1}')).toEqual({ a: 1 })
    })

    it('parses a JSON number string', () => {
      expect(StringHelper.safeParse<number>('42')).toBe(42)
    })

    it('returns the original input when parsing fails and no fallback', () => {
      expect(StringHelper.safeParse('not-json')).toBe('not-json')
    })

    it('returns the provided fallback when parsing fails', () => {
      expect(StringHelper.safeParse('not-json', 'fallback')).toBe('fallback')
    })

    it('returns undefined fallback when parsing fails and fallback is undefined', () => {
      expect(StringHelper.safeParse<unknown>('not-json', undefined)).toBe('not-json')
    })
  })

  // ─── camelCase ───────────────────────────────────────────────────────────────
  describe('camelCase', () => {
    it('converts snake_case to camelCase', () => {
      expect(StringHelper.camelCase('hello_world')).toBe('helloWorld')
    })

    it('converts kebab-case to camelCase', () => {
      expect(StringHelper.camelCase('hello-world')).toBe('helloWorld')
    })

    it('converts space-separated words to camelCase', () => {
      expect(StringHelper.camelCase('hello world')).toBe('helloWorld')
    })

    it('handles multiple separators', () => {
      expect(StringHelper.camelCase('foo_bar-baz qux')).toBe('fooBarBazQux')
    })

    it('returns empty string for empty input', () => {
      expect(StringHelper.camelCase('')).toBe('')
    })

    it('lowercases the first segment', () => {
      expect(StringHelper.camelCase('HELLO_WORLD')).toBe('helloWORLD')
    })

    it('handles single word', () => {
      expect(StringHelper.camelCase('hello')).toBe('hello')
    })
  })

  // ─── interpolate ─────────────────────────────────────────────────────────────
  describe('interpolate', () => {
    it('replaces a single placeholder', () => {
      expect(StringHelper.interpolate('Hello {{name}}!', { name: 'World' })).toBe('Hello World!')
    })

    it('replaces multiple placeholders', () => {
      expect(StringHelper.interpolate('{{a}} + {{b}} = {{c}}', { a: 1, b: 2, c: 3 })).toBe(
        '1 + 2 = 3',
      )
    })

    it('leaves unresolved placeholders unchanged', () => {
      expect(StringHelper.interpolate('Hello {{name}}!', {})).toBe('Hello {{name}}!')
    })

    it('handles numeric values', () => {
      expect(StringHelper.interpolate('Count: {{n}}', { n: 99 })).toBe('Count: 99')
    })

    it('returns template unchanged when vars is empty', () => {
      expect(StringHelper.interpolate('no placeholders', {})).toBe('no placeholders')
    })
  })

  // ─── truncate ────────────────────────────────────────────────────────────────
  describe('truncate', () => {
    it('returns input unchanged when within maxLength', () => {
      expect(StringHelper.truncate('hello', 10)).toBe('hello')
    })

    it('returns input unchanged when equal to maxLength', () => {
      expect(StringHelper.truncate('hello', 5)).toBe('hello')
    })

    it('truncates and appends default suffix', () => {
      expect(StringHelper.truncate('hello world', 8)).toBe('hello w…')
    })

    it('truncates and appends custom suffix', () => {
      expect(StringHelper.truncate('hello world', 8, '...')).toBe('hello...')
    })

    it('returns only suffix when maxLength equals suffix length', () => {
      expect(StringHelper.truncate('hello world', 1)).toBe('…')
    })

    it('returns empty string when maxLength is 0 and suffix is empty', () => {
      expect(StringHelper.truncate('hello', 0, '')).toBe('')
    })

    it('cutAt is clamped to 0 when maxLength < suffix length', () => {
      expect(StringHelper.truncate('hello world', 2, '...')).toBe('...')
    })
  })

  // ─── generateReferenceCode ───────────────────────────────────────────────────
  describe('generateReferenceCode', () => {
    it('returns a string matching the expected format', () => {
      const code = StringHelper.generateReferenceCode('TRV')
      expect(code).toMatch(/^TRV-[A-Z0-9]{6}-\d{4}$/)
    })

    it('includes the current year', () => {
      const year = new Date().getFullYear()
      const code = StringHelper.generateReferenceCode('TST')
      expect(code).toContain(`-${year}`)
    })

    it('generates different codes on successive calls', () => {
      const a = StringHelper.generateReferenceCode('X')
      const b = StringHelper.generateReferenceCode('X')
      // Probabilistically different (1/36^6 chance of collision)
      expect(a === b).toBe(false)
    })

    it('uses the provided prefix', () => {
      const code = StringHelper.generateReferenceCode('ABC')
      expect(code.startsWith('ABC-')).toBe(true)
    })
  })

  // ─── getSingleValue ──────────────────────────────────────────────────────────
  describe('getSingleValue', () => {
    it('returns the string itself when input is a string', () => {
      expect(StringHelper.getSingleValue('hello')).toBe('hello')
    })

    it('returns the first element when input is an array', () => {
      expect(StringHelper.getSingleValue(['first', 'second'])).toBe('first')
    })

    it('returns undefined when input is an empty array', () => {
      expect(StringHelper.getSingleValue([])).toBeUndefined()
    })

    it('returns the single element of a one-item array', () => {
      expect(StringHelper.getSingleValue(['only'])).toBe('only')
    })
  })
})
