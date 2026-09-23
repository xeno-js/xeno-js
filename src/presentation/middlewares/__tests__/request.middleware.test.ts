import type { ILogger, IServiceExtractor, RequestContext } from '@xeno-js/shared'
import type { HttpHeaders, HttpMethod, Metadata } from '@xeno-js/shared'
import { ERROR_CODES } from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ApplicationRegistry, IIPResolver, IRequestContext } from '@/domain'

import { RequestContextMiddleware } from '../request.middleware'

const headers: HttpHeaders = { authorization: 'Bearer tok' }
const path = '/api/test'
const method: HttpMethod = 'GET'
const transport = { res: '', req: '' }

function makeExtractor(meta: Partial<Metadata> = {}): IServiceExtractor<HttpHeaders, Metadata> {
  return {
    extract: vi.fn().mockReturnValue({
      correlationId: undefined,
      requestId: undefined,
      token: undefined,
      clientIp: undefined,
      spanId: undefined,
      parentSpanId: undefined,
      formatIndicator: 'application/json',
      userAgent: undefined,
      returnAddress: undefined,
      sequence: { sequenceId: undefined, position: undefined, size: undefined },
      expiration: undefined,
      ...meta,
    }),
  }
}

function makeResolver(resolvedIp: string | undefined = '127.0.0.1'): IIPResolver {
  return {
    resolve: vi.fn().mockReturnValue(resolvedIp),
  }
}

function makeMiddleware(extractor = makeExtractor(), resolver = makeResolver('127.0.0.1')) {
  let captured: RequestContext | undefined
  const runAsync = vi
    .fn()
    .mockImplementation((context: RequestContext, callback: () => Promise<unknown>) => {
      captured = context
      return callback()
    })
  const requestContext = { runAsync } as unknown as IRequestContext<
    RequestContext,
    ApplicationRegistry<unknown>
  >
  const error = vi.fn()
  const logger: ILogger = { info: vi.fn(), warn: vi.fn(), error, debug: vi.fn() }
  return {
    middleware: new RequestContextMiddleware(requestContext, extractor, resolver, logger),
    runAsync,
    getContext: () => captured,
    error,
  }
}

describe('RequestContextMiddleware', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('extracts metadata, runs the context and returns next result', async () => {
    const extractor = makeExtractor()
    const { middleware, runAsync } = makeMiddleware(extractor)
    const next = vi.fn().mockResolvedValue({ status: 200, ok: true, headers: {}, data: {} })

    const response = await middleware.execute({ method, path, transport }, headers, next)

    expect(response.ok).toBe(true)
    expect(runAsync).toHaveBeenCalledOnce()
    expect(next).toHaveBeenCalledOnce()
  })

  it('maps network, tracing and messaging metadata', async () => {
    const { middleware, getContext } = makeMiddleware(
      makeExtractor({
        clientIp: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        correlationId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        requestId: 'ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj',
        spanId: 'ffffffff-span-hhhh-span-jjjjjjjjjjjj',
        parentSpanId: 'parent',
        returnAddress: 'queue://reply',
        expiration: 5000,
        sequence: { sequenceId: 'seq', position: 1, size: 10 },
      }),
    )

    await middleware.execute({ method, path, transport }, headers, vi.fn().mockResolvedValue({}))

    expect(getContext()?.network).toMatchObject({
      clientIp: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      path,
      transport,
      requestId: 'ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj',
    })
    expect(getContext()?.tracing).toMatchObject({
      correlationId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      spanId: 'ffffffff-span-hhhh-span-jjjjjjjjjjjj',
      parentSpanId: 'parent',
    })
    expect(getContext()?.messaging).toEqual({
      returnAddress: 'queue://reply',
      expiration: 5000,
      sequence: { sequenceId: 'seq', position: 1, size: 10 },
    })
  })

  it('generates missing correlation, request and span identifiers', async () => {
    const { middleware, getContext } = makeMiddleware()

    await middleware.execute({ method, path, transport }, headers, vi.fn().mockResolvedValue({}))

    expect(getContext()?.network.requestId).toEqual(expect.any(String))
    expect(getContext()?.tracing.correlationId).toEqual(expect.any(String))
    expect(getContext()?.tracing.spanId).toEqual(expect.any(String))
  })

  it('preserves the metadata format indicator', async () => {
    const { middleware, getContext } = makeMiddleware(
      makeExtractor({ formatIndicator: 'application/xml' }),
    )

    await middleware.execute({ method, path, transport }, headers, vi.fn().mockResolvedValue({}))

    expect(getContext()?.network.formatIndicator).toBe('application/xml')
  })

  it('returns a system error when extraction throws', async () => {
    const extractor = {
      extract: vi.fn().mockImplementation(() => {
        throw new Error('parse fail')
      }),
    } as unknown as IServiceExtractor<HttpHeaders, Metadata>
    const { middleware, error } = makeMiddleware(extractor)

    const response = await middleware.execute({ method, path, transport }, headers, vi.fn())

    expect(response).toMatchObject({ status: 500, ok: false })
    expect((response.data as { error: { code: string; details: string } }).error).toMatchObject({
      code: ERROR_CODES.SYSTEM_ERROR,
      details: `[Fatal System Error] Exception caught during request handling on path: ${path}`,
    })
    expect(error).toHaveBeenCalledWith(
      'RequestContextMiddleware encountered an error',
      expect.any(Error),
    )
  })

  it('returns a system error when next rejects with a non-Error value', async () => {
    const { middleware, error } = makeMiddleware()
    const response = await middleware.execute(
      { method, path, transport },
      headers,
      vi.fn().mockRejectedValue('string error'),
    )

    expect(response.ok).toBe(false)
    expect((response.data as { error: { code: string } }).error.code).toBe(ERROR_CODES.SYSTEM_ERROR)
    expect(error).toHaveBeenCalledWith(
      'RequestContextMiddleware encountered an error',
      'string error',
    )
  })

  it('uses the metadata format indicator for error content type', async () => {
    const { middleware } = makeMiddleware(makeExtractor({ formatIndicator: 'application/xml' }))
    const response = await middleware.execute(
      { method, path, transport },
      headers,
      vi.fn().mockRejectedValue(new Error('failed')),
    )

    expect(response.headers['Content-Type']).toEqual(['application/json'])
  })
})
