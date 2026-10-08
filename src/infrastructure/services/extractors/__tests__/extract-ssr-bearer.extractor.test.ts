import { describe, expect, it } from 'vitest'

import { SupabaseSsrTokenExtractor } from '../extract-ssr-bearer.extractor'

describe('SupabaseSsrTokenExtractor', () => {
  const extractor = new SupabaseSsrTokenExtractor()

  it('returns the bearer token from the Authorization header', () => {
    const headers = new Headers({ Authorization: 'Bearer access-token-from-header' })

    expect(extractor.extract(headers)).toBe('access-token-from-header')
  })

  it('ignores non-bearer authorization headers', () => {
    const headers = new Headers({ Authorization: 'Basic abc123' })

    expect(extractor.extract(headers)).toBeUndefined()
  })

  it('returns a token from an unchunked Supabase auth cookie', () => {
    const cookieValue = JSON.stringify({ access_token: 'access-token-from-cookie' })
    const headers = new Headers({
      Cookie: `sb-demo-auth-token=${encodeURIComponent(cookieValue)}`,
    })

    expect(extractor.extract(headers)).toBe('access-token-from-cookie')
  })

  it('reassembles chunked Supabase auth cookie values and extracts the access token', () => {
    const fullToken = JSON.stringify({ access_token: 'reassembled-token' })
    const partOne = fullToken.slice(0, 10)
    const partTwo = fullToken.slice(10)

    const headers = new Headers({
      Cookie: `sb-demo-auth-token.1=${encodeURIComponent(partOne)}; sb-demo-auth-token.2=${encodeURIComponent(partTwo)}`,
    })

    expect(extractor.extract(headers)).toBe('reassembled-token')
  })

  it('returns undefined when the cookie does not contain a valid Supabase auth token', () => {
    const headers = new Headers({ Cookie: 'other=value; session=active' })

    expect(extractor.extract(headers)).toBeUndefined()
  })

  it('returns undefined when the Supabase auth cookie payload is invalid JSON', () => {
    const headers = new Headers({
      Cookie: `sb-demo-auth-token=${encodeURIComponent('not-json')}`,
    })

    expect(extractor.extract(headers)).toBeUndefined()
  })
})
