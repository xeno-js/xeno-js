import type {
  ExtendedRequest,
  IContextAccessor,
  RequestContext,
  ResponseDto,
} from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CORSMiddleware } from '../cors.middleware'

function makeMiddleware(contextData?: RequestContext, withCredentials: 'true' | 'false' = 'false') {
  const getContext = vi.fn().mockReturnValue(contextData)
  const requestContext = { getContext } as unknown as IContextAccessor<RequestContext>
  const middleware = new CORSMiddleware(requestContext, withCredentials)

  return { middleware, getContext }
}

describe('CORSMiddleware', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('passes the response through unchanged when the request has no origin and no headers exist', async () => {
    const { middleware, getContext } = makeMiddleware({
      network: {
        requestId: '11111111-1111-4111-8111-111111111111',
        clientIp: '127.0.0.1',
        userAgent: 'vitest',
        formatIndicator: 'application/json',
        path: '/api/test',
        csrf: 'csrf-token',
        csrfCookie: 'cookie-token',
        origin: undefined,
      },
    } as unknown as RequestContext)
    const response = {
      status: 200,
      ok: true,
      headers: undefined,
    } as unknown as ResponseDto<{ ok: true }>
    const next = vi.fn().mockResolvedValue(response)

    const result = await middleware.execute(
      { path: '/api/test', method: 'GET' } as unknown as ExtendedRequest,
      {} as Response,
      next,
    )

    expect(result).toBe(response)
    expect(getContext).toHaveBeenCalledOnce()
    expect(next).toHaveBeenCalledOnce()
    expect(result.headers).toBeUndefined()
  })

  it('keeps the original headers untouched when the request has no origin', async () => {
    const { middleware } = makeMiddleware({
      network: {
        requestId: '22222222-2222-4222-8222-222222222222',
        clientIp: '127.0.0.1',
        userAgent: 'vitest',
        formatIndicator: 'application/json',
        path: '/api/test',
        csrf: 'csrf-token',
        csrfCookie: 'cookie-token',
        origin: undefined,
      },
    } as unknown as RequestContext)
    const response = {
      status: 200,
      ok: true,
      headers: { 'Content-Type': ['application/json'] },
    } as unknown as ResponseDto<{ ok: true }>
    const next = vi.fn().mockResolvedValue(response)

    const result = await middleware.execute(
      { path: '/api/test', method: 'GET' } as unknown as ExtendedRequest,
      {} as Response,
      next,
    )

    expect(result).toBe(response)
    expect(result.headers).toEqual({ 'Content-Type': ['application/json'] })
  })

  it('adds CORS headers when the request origin is available', async () => {
    const { middleware } = makeMiddleware({
      network: {
        requestId: '33333333-3333-4333-8333-333333333333',
        clientIp: '127.0.0.1',
        userAgent: 'vitest',
        formatIndicator: 'application/json',
        path: '/api/test',
        csrf: 'csrf-token',
        csrfCookie: 'cookie-token',
        origin: 'https://app.example.com',
      },
    } as unknown as RequestContext)
    const response = {
      status: 200,
      ok: true,
      headers: { 'Content-Type': ['application/json'] },
    } as unknown as ResponseDto<{ ok: true }>
    const next = vi.fn().mockResolvedValue(response)

    const result = await middleware.execute(
      { path: '/api/test', method: 'GET' } as unknown as ExtendedRequest,
      {} as Response,
      next,
    )

    expect(result).toBe(response)
    expect(result.headers).toMatchObject({
      'Content-Type': ['application/json'],
      'Access-Control-Allow-Origin': 'https://app.example.com',
      'Access-Control-Allow-Credentials': 'false',
      'Vary': 'Origin',
    })
  })

  it('supports credentials enabled mode', async () => {
    const { middleware } = makeMiddleware(
      {
        network: {
          requestId: '44444444-4444-4444-8444-444444444444',
          clientIp: '127.0.0.1',
          userAgent: 'vitest',
          formatIndicator: 'application/json',
          path: '/api/test',
          csrf: 'csrf-token',
          csrfCookie: 'cookie-token',
          origin: 'https://app.example.com',
        },
      } as unknown as RequestContext,
      'true',
    )
    const response = {
      status: 200,
      ok: true,
      headers: undefined,
    } as unknown as ResponseDto<{ ok: true }>
    const next = vi.fn().mockResolvedValue(response)

    const result = await middleware.execute(
      { path: '/api/test', method: 'GET' } as unknown as ExtendedRequest,
      {} as Response,
      next,
    )

    expect(result.headers).toMatchObject({
      'Access-Control-Allow-Origin': 'https://app.example.com',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin',
    })
  })
})
