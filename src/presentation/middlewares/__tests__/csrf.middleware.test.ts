import type { Guid, NetworkContext, RequestContext } from '@xeno-js/shared'
import type { HttpMethod } from '@xeno-js/shared'
import { ERROR_CODES, STATUS_CODES } from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ApplicationRegistry, ICsrfTokenService, IRequestContext } from '@/domain'

import { CsrfMiddleware } from '../csrf.middleware'

const path = '/api/protected'
const transport = { res: '', req: '' }

function makeMiddleware(
  _cookieNamemethod: HttpMethod = 'POST',
  contextData: Partial<RequestContext> | undefined = {
    network: {
      csrf: 'valid-token',
      csrfCookie: 'valid-token',
      formatIndicator: 'application/json',
    } as unknown as NetworkContext,
    identity: {
      userId: 'user-123' as Guid,
      tenantId: '123' as Guid,
      roles: [],
      permissions: [],
      email: 'admin@admin.com',
      name: 'admin',
    },
  },
  validateResult = true,
) {
  const getContext = vi.fn().mockReturnValue(contextData)
  const ctxAccessor = { getContext } as unknown as IRequestContext<
    RequestContext,
    ApplicationRegistry<unknown>
  >

  const validate = vi.fn().mockResolvedValue(validateResult)
  const csrfTokenService = { validate } as unknown as ICsrfTokenService

  const middleware = new CsrfMiddleware(ctxAccessor, csrfTokenService)

  return { middleware, validate, getContext }
}

describe('CsrfMiddleware', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('allows safe methods (GET) without checking CSRF tokens', async () => {
    const { middleware, validate } = makeMiddleware('GET', undefined)
    const next = vi.fn().mockResolvedValue({ status: 200, ok: true, data: {} })

    const response = await middleware.execute({ method: 'GET', path, transport }, {}, next)

    expect(response.ok).toBe(true)
    expect(next).toHaveBeenCalledOnce()
    expect(validate).not.toHaveBeenCalled()
  })

  it('allows state-changing requests when tokens match and are valid', async () => {
    const { middleware, validate } = makeMiddleware(
      'POST',
      {
        network: {
          csrf: 'valid-token',
          csrfCookie: 'valid-token',
          formatIndicator: 'application/json',
        } as unknown as NetworkContext,
        identity: {
          userId: 'user-123' as Guid,
          tenantId: '123' as Guid,
          roles: [],
          permissions: [],
          email: 'admin@admin.com',
          name: 'admin',
        },
      },
      true,
    )
    const next = vi.fn().mockResolvedValue({ status: 201, ok: true, data: {} })

    const response = await middleware.execute({ method: 'POST', path, transport }, {}, next)

    expect(response.ok).toBe(true)
    expect(next).toHaveBeenCalledOnce()
    expect(validate).toHaveBeenCalledWith('valid-token', 'user-123')
  })

  it('returns 403 when headerToken or cookieToken is missing', async () => {
    const { middleware } = makeMiddleware('POST', {
      network: {
        csrf: 'valid-token',
        csrfCookie: undefined,
        formatIndicator: 'application/json',
      } as unknown as NetworkContext,
      identity: {
        userId: 'user-123' as Guid,
        tenantId: '123' as Guid,
        roles: [],
        permissions: [],
        email: 'admin@admin.com',
        name: 'admin',
      },
    })
    const next = vi.fn()

    const response = await middleware.execute({ method: 'POST', path, transport }, {}, next)

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN)
    expect(response.ok).toBe(false)
    expect(next).not.toHaveBeenCalled()

    const data = response.data as { error: { code: string; details: string } }
    expect(data.error.code).toBe(ERROR_CODES.FORBIDDEN)
    expect(data.error.details).toBe('CSRF token missing')
  })

  it('returns 403 when headerToken and cookieToken do not match', async () => {
    const { middleware } = makeMiddleware('POST', {
      network: {
        csrf: 'token-abc',
        csrfCookie: 'token-xyz',
        formatIndicator: 'application/json',
      } as unknown as NetworkContext,
      identity: {
        userId: 'user-123' as Guid,
        tenantId: '123' as Guid,
        roles: [],
        permissions: [],
        email: 'admin@admin.com',
        name: 'admin',
      },
    })
    const next = vi.fn()

    const response = await middleware.execute({ method: 'POST', path, transport }, {}, next)

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN)
    expect(response.ok).toBe(false)
    expect(next).not.toHaveBeenCalled()

    const data = response.data as { error: { details: string } }
    expect(data.error.details).toBe('CSRF token mismatch')
  })

  it('returns 403 when userId is missing in the identity context', async () => {
    const { middleware, validate } = makeMiddleware('POST', {
      network: {
        csrf: 'valid-token',
        csrfCookie: undefined,
        formatIndicator: 'application/json',
      } as unknown as NetworkContext,
      identity: {
        userId: 'user-123' as Guid,
        tenantId: '123' as Guid,
        roles: [],
        permissions: [],
        email: 'admin@admin.com',
        name: 'admin',
      },
    })
    const next = vi.fn()

    const response = await middleware.execute({ method: 'POST', path, transport }, {}, next)

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN)
    expect(response.ok).toBe(false)
    expect(next).not.toHaveBeenCalled()
    expect(validate).not.toHaveBeenCalled()

    const data = response.data as { error: { details: string } }
    expect(data.error.details).toBe('CSRF token missing')
  })

  it('returns 403 when csrfTokenService validation fails', async () => {
    const { middleware, validate } = makeMiddleware(
      'POST',
      {
        network: {
          csrf: 'valid-token',
          csrfCookie: 'valid-token',
          formatIndicator: 'application/json',
        } as unknown as NetworkContext,
        identity: {
          userId: 'user-123' as Guid,
          tenantId: '123' as Guid,
          roles: [],
          permissions: [],
          email: 'admin@admin.com',
          name: 'admin',
        },
      },
      false,
    ) // validate returns false
    const next = vi.fn()

    const response = await middleware.execute({ method: 'POST', path, transport }, {}, next)

    expect(response.status).toBe(STATUS_CODES.FORBIDDEN)
    expect(response.ok).toBe(false)
    expect(next).not.toHaveBeenCalled()
    expect(validate).toHaveBeenCalledOnce()

    const data = response.data as { error: { details: string } }
    expect(data.error.details).toBe('CSRF token invalid')
  })
})
