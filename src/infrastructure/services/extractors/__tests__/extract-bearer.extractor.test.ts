import { describe, expect, it } from 'vitest'

import { BearerTokenExtractor } from '../extract-bearer.extractor'

describe('BearerTokenExtractor', () => {
  describe('extract', () => {
    it('returns the token when authorization header starts with "Bearer "', () => {
      const extractor = new BearerTokenExtractor('sb-access-token')
      const headers = new Headers({ Authorization: 'Bearer mytoken123' })

      expect(extractor.extract(headers)).toBe('mytoken123')
    })

    it('is case-insensitive for the "bearer " prefix', () => {
      const extractor = new BearerTokenExtractor('sb-access-token')
      const headers = new Headers({ Authorization: 'BEARER mytoken123' })

      expect(extractor.extract(headers)).toBe('mytoken123')
    })

    it('returns undefined when authorization header is missing', () => {
      const extractor = new BearerTokenExtractor('sb-access-token')

      expect(extractor.extract(new Headers())).toBeUndefined()
    })

    it('returns undefined when authorization header does not start with "Bearer "', () => {
      const extractor = new BearerTokenExtractor('sb-access-token')
      const headers = new Headers({ Authorization: 'Basic dXNlcjpwYXNz' })

      expect(extractor.extract(headers)).toBeUndefined()
    })

    it('returns undefined when authorization header is just "Bearer" (no space)', () => {
      const extractor = new BearerTokenExtractor('sb-access-token')
      const headers = new Headers({ Authorization: 'Bearer' })

      expect(extractor.extract(headers)).toBeUndefined()
    })

    it('returns undefined when authorization header is "Bearer " with no token', () => {
      const extractor = new BearerTokenExtractor('sb-access-token')
      const headers = new Headers({ Authorization: 'Bearer ' })

      expect(extractor.extract(headers)).toBeUndefined()
    })

    it('falls back to the configured cookie token when Authorization is missing', () => {
      const extractor = new BearerTokenExtractor('sb-access-token')
      const headers = new Headers({
        cookie: 'other=value; sb-access-token=my-cookie-token; theme=dark',
      })

      expect(extractor.extract(headers)).toBe('my-cookie-token')
    })

    it('returns undefined when no matching cookie prefix is present', () => {
      const extractor = new BearerTokenExtractor('sb-access-token')
      const headers = new Headers({
        cookie: 'session=abc; theme=dark',
      })

      expect(extractor.extract(headers)).toBeUndefined()
    })
  })
})
