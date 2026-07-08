import { describe, expect, it } from 'vitest'

import type { ErrorResponseDto } from '@/shared'
import { HttpHelper, type IPaginatedResult } from '@/shared'

const VALID_GUID = '550e8400-e29b-41d4-a716-446655440000'

describe('HttpHelper.normalizeHeaders', () => {
  describe('non-object / falsy input', () => {
    it('returns {} when headers is undefined', () => {
      expect(HttpHelper.normalizeHeaders(undefined)).toEqual({})
    })

    it('returns {} when headers is null', () => {
      expect(HttpHelper.normalizeHeaders(null)).toEqual({})
    })

    it('returns {} when headers is empty string', () => {
      expect(HttpHelper.normalizeHeaders('')).toEqual({})
    })

    it('returns {} when headers is false', () => {
      expect(HttpHelper.normalizeHeaders(false)).toEqual({})
    })

    it('returns {} when headers is a number', () => {
      expect(HttpHelper.normalizeHeaders(42)).toEqual({})
    })

    it('returns {} when headers is a non-empty plain string', () => {
      expect(HttpHelper.normalizeHeaders('content-type: text/html')).toEqual({})
    })
  })

  describe('array input (typeof === object)', () => {
    it('treats array as object with numeric keys', () => {
      expect(HttpHelper.normalizeHeaders(['a', 'b'])).toEqual({ '0': 'a', '1': 'b' })
    })
  })

  describe('valid plain-object input', () => {
    it('returns {} when headers is an empty object', () => {
      expect(HttpHelper.normalizeHeaders({})).toEqual({})
    })

    it('skips keys with undefined value', () => {
      expect(HttpHelper.normalizeHeaders({ a: undefined })).toEqual({})
    })

    it('skips keys with null value', () => {
      expect(HttpHelper.normalizeHeaders({ a: null })).toEqual({})
    })

    it('skips keys with false value', () => {
      expect(HttpHelper.normalizeHeaders({ a: false })).toEqual({ a: 'false' })
    })

    it('converts string values as-is', () => {
      expect(HttpHelper.normalizeHeaders({ 'content-type': 'application/json' })).toEqual({
        'content-type': 'application/json',
      })
    })

    it('converts numeric values to string', () => {
      expect(HttpHelper.normalizeHeaders({ 'x-retry': 3 })).toEqual({ 'x-retry': '3' })
    })

    it('converts true boolean to string', () => {
      expect(HttpHelper.normalizeHeaders({ 'x-flag': true })).toEqual({ 'x-flag': 'true' })
    })

    it('joins array values with comma', () => {
      expect(HttpHelper.normalizeHeaders({ accept: ['text/html', 'application/json'] })).toEqual({
        accept: 'text/html,application/json',
      })
    })

    it('joins array of numbers to comma-separated string', () => {
      expect(HttpHelper.normalizeHeaders({ ids: [1, 2, 3] })).toEqual({ ids: '1,2,3' })
    })

    it('processes multiple keys, skipping undefined ones', () => {
      expect(
        HttpHelper.normalizeHeaders({
          'content-type': 'application/json',
          'accept': ['text/html', 'application/xml'],
          'x-count': 5,
          'skip': undefined,
        }),
      ).toEqual({
        'content-type': 'application/json',
        'accept': 'text/html,application/xml',
        'x-count': '5',
      })
    })
  })

  describe('immutability', () => {
    it('HttpHelper is frozen', () => {
      expect(Object.isFrozen(HttpHelper)).toBe(true)
    })

    it('does not mutate the input object', () => {
      const input: Record<string, string> = { a: 'value' }
      HttpHelper.normalizeHeaders(input)
      expect(input).toEqual({ a: 'value' })
    })
  })
})

describe('HttpHelper.success', () => {
  it('returns ok=true with default status 200', () => {
    const res = HttpHelper.success({ id: 1 })
    expect(res.ok).toBe(true)
    expect(res.status).toBe(200)
  })

  it('wraps data in SuccessResponseDto shape', () => {
    const res = HttpHelper.success('hello')
    expect(res.data).toMatchObject({ success: true, data: 'hello', meta: {} })
  })

  it('accepts a custom status code', () => {
    const res = HttpHelper.success(null, 201)
    expect(res.status).toBe(201)
  })

  it('forwards custom meta', () => {
    const res = HttpHelper.success({}, 200, { page: 1 })
    expect((res.data as { meta: unknown }).meta).toEqual({ page: 1 })
  })

  it('includes default Content-Type header', () => {
    const res = HttpHelper.success({})
    expect(res.headers['Content-Type']).toEqual(['application/json'])
  })

  it('merges custom headers with Content-Type', () => {
    const res = HttpHelper.success({}, 200, {}, { 'X-Custom': 'value' })
    expect(res.headers['X-Custom']).toBe('value')
    expect(res.headers['Content-Type']).toEqual(['application/json'])
  })

  it('custom header does not override Content-Type', () => {
    const res = HttpHelper.success({}, 200, {}, { 'Content-Type': 'text/plain' })
    expect(res.headers['Content-Type']).toEqual(['application/json'])
  })

  it('supports paginated data', () => {
    const paginatedData: IPaginatedResult<string> = {
      items: ['item1', 'item2'],
      total: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    }
    const res = HttpHelper.success(paginatedData)
    expect(res.data).toMatchObject({ success: true, data: paginatedData, meta: {} })
  })
})

describe('HttpHelper.error', () => {
  const errorBase: ErrorResponseDto = {
    success: false,
    error: { code: 'ERR', message: 'fail', details: undefined, path: undefined },
    correlationId: VALID_GUID,
    requestId: VALID_GUID,
    spanId: VALID_GUID,
    timestamp: new Date().toISOString(),
  }

  it('returns ok=false', () => {
    const res = HttpHelper.error(errorBase)
    expect(res.ok).toBe(false)
  })

  it('uses provided status', () => {
    const res = HttpHelper.error(errorBase, 404)
    expect(res.status).toBe(404)
  })

  it('defaults to 500 when status is null', () => {
    const res = HttpHelper.error(errorBase, undefined)
    expect(res.status).toBe(500)
  })

  it('sets error code and message in payload', () => {
    const dto: ErrorResponseDto = {
      ...errorBase,
      error: {
        code: 'NOT_FOUND',
        message: 'resource missing',
        details: undefined,
        path: undefined,
      },
    }
    const res = HttpHelper.error(dto)
    const payload = res.data as { error: { code: string; message: string } }
    expect(payload.error.code).toBe('NOT_FOUND')
    expect(payload.error.message).toBe('resource missing')
  })

  it('sets details when provided', () => {
    const dto: ErrorResponseDto = {
      ...errorBase,
      error: { code: 'ERR', message: 'fail', details: 'stack trace', path: undefined },
    }
    const res = HttpHelper.error(dto)
    const payload = res.data as { error: { details: string | undefined } }
    expect(payload.error.details).toBe('stack trace')
  })

  it('sets details to undefined when null', () => {
    const res = HttpHelper.error(errorBase)
    const payload = res.data as { error: { details: string | undefined } }
    expect(payload.error.details).toBeUndefined()
  })

  it('uses provided correlationId', () => {
    const cid = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    const dto: ErrorResponseDto = { ...errorBase, correlationId: cid }
    const res = HttpHelper.error(dto)
    const payload = res.data as { correlationId: string }
    expect(payload.correlationId).toBe(cid)
    expect(res.headers['X-Correlation-Id']).toEqual([cid])
  })

  it('uses correlationId when provided', () => {
    const res = HttpHelper.error(errorBase)
    const payload = res.data as { correlationId: string }
    expect(typeof payload.correlationId).toBe('string')
    expect(payload.correlationId.length).toBeGreaterThan(0)
  })

  it('uses provided requestId', () => {
    const rid = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    const dto: ErrorResponseDto = { ...errorBase, requestId: rid }
    const res = HttpHelper.error(dto)
    const payload = res.data as { requestId: string }
    expect(payload.requestId).toBe(rid)
    expect(res.headers['X-Request-Id']).toEqual([rid])
  })

  it('uses requestId when provided', () => {
    const res = HttpHelper.error(errorBase)
    const payload = res.data as { requestId: string }
    expect(typeof payload.requestId).toBe('string')
  })

  it('includes standard error headers', () => {
    const res = HttpHelper.error(errorBase)
    expect(res.headers['Content-Type']).toEqual(['application/json'])
    expect(res.headers['Cache-Control']).toEqual([
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    ])
    expect(res.headers['Pragma']).toEqual(['no-cache'])
    expect(res.headers['Expires']).toEqual(['0'])
  })

  it('merges customHeaders', () => {
    const res = HttpHelper.error(errorBase, undefined, { 'X-Retry-After': '60' })
    expect(res.headers['X-Retry-After']).toBe('60')
  })

  it('handles null customHeaders without error', () => {
    expect(() => HttpHelper.error(errorBase, undefined, undefined)).not.toThrow()
  })

  it('timestamp is a valid ISO string', () => {
    const res = HttpHelper.error(errorBase)
    const payload = res.data as { timestamp: string }
    expect(() => new Date(payload.timestamp).toISOString()).not.toThrow()
  })
})
