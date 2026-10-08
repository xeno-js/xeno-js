import type { ExtendedRequest, INetworkContextAccessor, NetworkContext } from '@xeno-js/shared'
import { STATUS_CODES } from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { IAllowMethod } from '@/domain'

import { OptionsMiddleware } from '../options.middleware'

function makeMiddleware(
  networkContext?: Partial<NetworkContext>,
  methods = 'GET, POST',
  allowHeaders: string[] = ['Content-Type', 'Authorization'],
  withCredentials: 'true' | 'false' = 'false',
) {
  const getNetworkContext = vi.fn().mockReturnValue(networkContext)
  const requestContext = { getNetworkContext } as unknown as INetworkContextAccessor

  const getMethodsMock = vi.fn().mockReturnValue(methods)
  const allowMethod = {
    check: vi.fn(),
    getMethods: getMethodsMock,
  } as unknown as IAllowMethod

  const middleware = new OptionsMiddleware(
    requestContext,
    allowMethod,
    allowHeaders,
    withCredentials,
  )

  return { middleware, getNetworkContext, getMethodsMock }
}

describe('OptionsMiddleware', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('delegates non-OPTIONS requests to the next middleware', async () => {
    const { middleware, getNetworkContext, getMethodsMock } = makeMiddleware({
      origin: 'https://app.example.com',
    })
    const next = vi.fn().mockResolvedValue({ status: 200, ok: true, data: { ok: true } })

    const response = await middleware.execute(
      { path: '/api/test', method: 'GET' } as unknown as ExtendedRequest,
      {} as Response,
      next,
    )

    expect(response).toMatchObject({ status: 200, ok: true })
    expect(getNetworkContext).not.toHaveBeenCalled()
    expect(getMethodsMock).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledOnce()
  })

  it('returns a 204 CORS preflight response with allowed methods and headers for OPTIONS requests', async () => {
    const { middleware, getMethodsMock } = makeMiddleware(
      { origin: 'https://app.example.com' },
      'GET, POST, PUT',
      ['Content-Type', 'Authorization', 'X-Trace-Id'],
      'true',
    )

    const response = await middleware.execute(
      { path: '/api/test', method: 'OPTIONS' } as unknown as ExtendedRequest,
      {} as Response,
      vi.fn(),
    )

    expect(response.status).toBe(STATUS_CODES.NO_CONTENT)
    expect(response.ok).toBe(true)
    expect(getMethodsMock).toHaveBeenCalledWith('/api/test')
    expect(response.headers).toMatchObject({
      'Access-Control-Allow-Origin': 'https://app.example.com',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, POST, PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Trace-Id',
    })
  })

  it('returns a no-content response even when no origin is present in the request context', async () => {
    const { middleware, getMethodsMock } = makeMiddleware(
      { requestId: 'req-123' } as unknown as Partial<NetworkContext>,
      'GET, DELETE',
      ['X-Request-Id'],
    )

    const response = await middleware.execute(
      { path: '/api/private', method: 'OPTIONS' } as unknown as ExtendedRequest,
      {} as Response,
      vi.fn(),
    )

    expect(response.status).toBe(STATUS_CODES.NO_CONTENT)
    expect(response.ok).toBe(true)
    expect(getMethodsMock).toHaveBeenCalledWith('/api/private')
    expect(response.headers).not.toHaveProperty('Access-Control-Allow-Origin')
    expect(response.headers).toMatchObject({
      'Access-Control-Allow-Methods': 'GET, DELETE',
      'Access-Control-Allow-Headers': 'X-Request-Id',
    })
  })
})
