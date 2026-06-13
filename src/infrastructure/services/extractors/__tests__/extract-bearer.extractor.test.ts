import { describe, expect, it } from 'vitest'

import { BearerTokenExtractor } from '../extract-bearer.extractor'

describe('BearerTokenExtractor', () => {
  const extractor = new BearerTokenExtractor()

  describe('extract', () => {
    it('returns the token when authorization header starts with "Bearer "', () => {
      const headers = { authorization: 'Bearer mytoken123' }
      expect(extractor.extract(headers)).toBe('mytoken123')
    })

    it('is case-insensitive for the "bearer " prefix', () => {
      const headers = { authorization: 'BEARER mytoken123' }
      expect(extractor.extract(headers)).toBe('mytoken123')
    })

    it('returns undefined when authorization header is missing', () => {
      expect(extractor.extract({})).toBeUndefined()
    })

    it('returns undefined when authorization header is undefined', () => {
      const headers = { authorization: undefined as unknown as string }
      expect(extractor.extract(headers)).toBeUndefined()
    })

    it('returns undefined when authorization header does not start with "Bearer "', () => {
      const headers = { authorization: 'Basic dXNlcjpwYXNz' }
      expect(extractor.extract(headers)).toBeUndefined()
    })

    it('returns undefined when authorization header is just "Bearer" (no space)', () => {
      const headers = { authorization: 'Bearer' }
      expect(extractor.extract(headers)).toBeUndefined()
    })

    it('returns empty string token when header is "Bearer " (space only)', () => {
      const headers = { authorization: 'Bearer ' }
      expect(extractor.extract(headers)).toBe('')
    })

    it('accepts array header value and uses the first element', () => {
      const headers = { authorization: ['Bearer arraytoken', 'Bearer other'] }
      expect(extractor.extract(headers)).toBe('arraytoken')
    })
  })
})
