import { describe, expect, it } from 'vitest'

import { BearerTokenExtractor } from '../extract-bearer.extractor'

describe('BearerTokenExtractor', () => {
  const extractor = new BearerTokenExtractor('sb-access-token=')

  describe('extract', () => {
    it('returns the token when authorization header starts with "Bearer "', () => {
      const headers = new Headers({ Authorization: 'Bearer mytoken123' })
      expect(extractor.extract(headers)).toBe('mytoken123')
    })

    it('is case-insensitive for the "bearer " prefix', () => {
      const headers = new Headers({ Authorization: 'BEARER mytoken123' })
      expect(extractor.extract(headers)).toBe('mytoken123')
    })

    it('returns undefined when authorization header is missing', () => {
      expect(extractor.extract(new Headers())).toBeUndefined()
    })

    it('returns undefined when authorization header does not start with "Bearer "', () => {
      const headers = new Headers({ Authorization: 'Basic dXNlcjpwYXNz' })
      expect(extractor.extract(headers)).toBeUndefined()
    })

    it('returns undefined when authorization header is just "Bearer" (no space)', () => {
      const headers = new Headers({ Authorization: 'Bearer' })
      expect(extractor.extract(headers)).toBeUndefined()
    })

    it('returns empty string token when header is "Bearer " (space only)', () => {
      const headers = new Headers({ Authorization: 'Bearer ' })
      expect(extractor.extract(headers)).toBe(undefined)
    })
  })
})
