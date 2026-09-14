import { describe, expect, it, vi } from 'vitest'

import { HttpHeaderExtractor } from '../http-header.extractor'

const VALID_GUID = '550e8400-e29b-41d4-a716-446655440000'
const TOKEN = 'mytoken'

function makeBearerExtractor(token: string | undefined) {
  return { extract: vi.fn().mockReturnValue(token) }
}

describe('HttpHeaderExtractor', () => {
  describe('extract', () => {
    it('returns a fully populated Metadata when all headers are present', () => {
      const bearer = makeBearerExtractor(TOKEN)
      const extractor = new HttpHeaderExtractor(bearer, undefined)

      const headers = {
        'x-correlation-id': VALID_GUID,
        'x-request-id': VALID_GUID,
        'x-forwarded-for': '192.168.1.1',
        'x-span-id': VALID_GUID,
      }

      const result = extractor.extract(headers)

      expect(result.correlationId).toBe(VALID_GUID)
      expect(result.requestId).toBe(VALID_GUID)
      expect(result.token).toBe(TOKEN)
      expect(result.clientIp).toBe('192.168.1.1')
      expect(result.spanId).toBe(VALID_GUID)
    })

    it('returns undefined fields when headers are absent', () => {
      const bearer = makeBearerExtractor(undefined)
      const extractor = new HttpHeaderExtractor(bearer, undefined)

      const result = extractor.extract({})

      expect(result.correlationId).toBeUndefined()
      expect(result.requestId).toBeUndefined()
      expect(result.token).toBeUndefined()
      expect(result.clientIp).toBeUndefined()
      expect(result.spanId).toBeUndefined()
    })

    it('returns undefined for correlationId when value is not a valid GUID', () => {
      const bearer = makeBearerExtractor(undefined)
      const extractor = new HttpHeaderExtractor(bearer, undefined)

      const result = extractor.extract({ 'x-correlation-id': 'not-a-guid' })

      expect(result.correlationId).toBeUndefined()
    })

    it('returns undefined for requestId when value is not a valid GUID', () => {
      const bearer = makeBearerExtractor(undefined)
      const extractor = new HttpHeaderExtractor(bearer, undefined)

      const result = extractor.extract({ 'x-request-id': 'not-a-guid' })

      expect(result.requestId).toBeUndefined()
    })

    it('delegates token extraction to the injected bearerExtractor', () => {
      const bearer = makeBearerExtractor(TOKEN)
      const extractor = new HttpHeaderExtractor(bearer, undefined)
      const headers = { authorization: `Bearer ${TOKEN}` }

      extractor.extract(headers)

      expect(bearer.extract).toHaveBeenCalledOnce()
      expect(bearer.extract).toHaveBeenCalledWith(headers)
    })

    it('accepts array header values for x-forwarded-for', () => {
      const bearer = makeBearerExtractor(undefined)
      const extractor = new HttpHeaderExtractor(bearer, undefined)

      const result = extractor.extract({ 'x-forwarded-for': ['10.0.0.1', '10.0.0.2'] })

      expect(result.clientIp).toBe('10.0.0.1')
    })
  })
})
