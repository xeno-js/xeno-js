import type { ExtendedRequest, IContextAccessor, ILogger, RequestContext } from '@xeno-js/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, STATUS_CODES } from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { IAllowOrigin } from '@/domain'

import { AllowOriginMiddleware } from '../allow-origin.middleware'

function makeMiddleware(
  isAllowed: boolean,
  contextData?: Partial<RequestContext>,
  logger: Partial<ILogger> = {},
) {
  const getContext = vi.fn().mockReturnValue(contextData)
  const requestContext = { getContext } as unknown as IContextAccessor<RequestContext>

  const isAllowedMock = vi.fn().mockReturnValue(isAllowed)
  const allowOrigin = { isAllowed: isAllowedMock } as unknown as IAllowOrigin

  const warn = vi.fn()
  const loggerService = { warn, ...logger } as unknown as ILogger

  const middleware = new AllowOriginMiddleware(allowOrigin, requestContext, loggerService)

  return { middleware, isAllowedMock, getContext, warn }
}

describe('AllowOriginMiddleware', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('allows the request when the origin is permitted', async () => {
    const nextResult = { status: 200, ok: true, data: { ok: true } }
    const context = {
      network: { origin: 'https://app.example.com', requestId: 'req-123' },
      tracing: { correlationId: 'corr-123', spanId: 'span-123' },
    } as unknown as RequestContext

    const { middleware, isAllowedMock, warn } = makeMiddleware(true, context)
    const req = { path: '/api/ok', method: 'GET' } as unknown as ExtendedRequest
    const next = vi.fn().mockResolvedValue(nextResult)

    const response = await middleware.execute(req, {} as Response, next)

    expect(response).toBe(nextResult)
    expect(isAllowedMock).toHaveBeenCalledWith('https://app.example.com')
    expect(next).toHaveBeenCalledOnce()
    expect(warn).not.toHaveBeenCalled()
  })

  it('blocks the request and returns 403 when the origin is not allowed', async () => {
    const context = {
      network: { origin: 'https://bad.example.com', requestId: 'req-456' },
      tracing: { correlationId: 'corr-456', spanId: 'span-456' },
    } as unknown as RequestContext

    const { middleware, isAllowedMock, warn } = makeMiddleware(false, context)
    const req = { path: '/api/blocked', method: 'GET' } as unknown as ExtendedRequest
    const next = vi.fn()

    const response = await middleware.execute(req, {} as Response, next)

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN)
    expect(response.ok).toBe(false)
    expect(next).not.toHaveBeenCalled()
    expect(isAllowedMock).toHaveBeenCalledWith('https://bad.example.com')
    expect(warn).toHaveBeenCalledWith(
      'Access denied by AllowOrigin policy for origin: https://bad.example.com',
    )
    expect(response.headers['X-Correlation-Id']).toEqual(['corr-456'])
    expect(response.headers['X-Request-Id']).toEqual(['req-456'])
    expect(response.headers['X-Span-Id']).toEqual(['span-456'])

    const data = response.data as {
      error: { code: string; message: string; details: string; path: string }
      correlationId: string
      requestId: string
      spanId: string
    }

    expect(data.error.code).toBe(ERROR_CODES.FORBIDDEN)
    expect(data.error.message).toBe(ERROR_CODE_MESSAGES[ERROR_CODES.FORBIDDEN])
    expect(data.error.details).toBe(
      "The origin 'https://bad.example.com' is not allowed to access this resource.",
    )
    expect(data.error.path).toBe('/api/blocked')
    expect(data.correlationId).toBe('corr-456')
    expect(data.requestId).toBe('req-456')
    expect(data.spanId).toBe('span-456')
  })

  it('uses fallback ids and unknown origin when the request context is missing', async () => {
    const { middleware, isAllowedMock, warn } = makeMiddleware(false, undefined)
    const req = { path: '/api/missing-context', method: 'GET' } as unknown as ExtendedRequest
    const next = vi.fn()

    const response = await middleware.execute(req, {} as Response, next)

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN)
    expect(response.ok).toBe(false)
    expect(next).not.toHaveBeenCalled()
    expect(isAllowedMock).toHaveBeenCalledWith(undefined)
    expect(warn).toHaveBeenCalledWith('Access denied by AllowOrigin policy for origin: unknown')

    const correlationHeader = response.headers['X-Correlation-Id'] as string[] | undefined
    const requestHeader = response.headers['X-Request-Id'] as string[] | undefined
    const spanHeader = response.headers['X-Span-Id'] as string[] | undefined

    expect(correlationHeader).toBeDefined()
    expect(requestHeader).toBeDefined()
    expect(spanHeader).toBeDefined()
    expect(correlationHeader?.[0]).toMatch(/^[0-9a-fA-F-]{36}$/)
    expect(requestHeader?.[0]).toMatch(/^[0-9a-fA-F-]{36}$/)
    expect(spanHeader?.[0]).toMatch(/^[0-9a-fA-F-]{36}$/)

    const data = response.data as {
      error: { code: string; details: string; path: string }
      correlationId: string
      requestId: string
      spanId: string
    }

    expect(data.error.code).toBe(ERROR_CODES.FORBIDDEN)
    expect(data.error.details).toBe("The origin 'unknown' is not allowed to access this resource.")
    expect(data.error.path).toBe('/api/missing-context')
    expect(data.correlationId).toMatch(/^[0-9a-fA-F-]{36}$/)
    expect(data.requestId).toMatch(/^[0-9a-fA-F-]{36}$/)
    expect(data.spanId).toMatch(/^[0-9a-fA-F-]{36}$/)
  })
})
