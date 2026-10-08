import { TOKENS } from '@xeno-js/shared'
import { describe, expect, it, vi } from 'vitest'

import type { ApplicationRegistry, IServiceContainer, IServiceScope } from '@/domain'

import { ContainerUtils } from '../container.utils'

type TestRegistry = ApplicationRegistry<unknown>

describe('ContainerUtils', () => {
  it('resolves a scoped service from the active scope', () => {
    const service = { name: 'scoped-service' }
    const resolveMock = vi.fn((token: string) => (token === 'SERVICE_TOKEN' ? service : undefined))
    const scope = {
      resolve: resolveMock,
    } as unknown as IServiceScope<TestRegistry>

    const container = {
      resolve: vi.fn((token: string) =>
        token === TOKENS.SERVICE_SCOPE_ACCESSOR ? { getScope: vi.fn(() => scope) } : undefined,
      ),
    } as unknown as IServiceContainer<TestRegistry>

    expect(ContainerUtils.resolveServiceScoped('SERVICE_TOKEN' as never, container)).toBe(service)
    expect(resolveMock).toHaveBeenCalledWith('SERVICE_TOKEN')
  })

  it('throws when no active scope is available for a scoped resolution', () => {
    const container = {
      resolve: vi.fn((token: string) =>
        token === TOKENS.SERVICE_SCOPE_ACCESSOR ? { getScope: vi.fn(() => undefined) } : undefined,
      ),
    } as unknown as IServiceContainer<TestRegistry>

    expect(() => ContainerUtils.resolveServiceScoped('SERVICE_TOKEN' as never, container)).toThrow(
      'Active service scope is required to execute Scoped service.',
    )
  })

  it('runs an action through the HTTP adapter and middleware pipeline', async () => {
    const req = { body: { ok: true } }
    const res = { status: 200 }
    const middlewareResponse = { ok: true, data: 'executed' }
    const adapter = {
      adapt: vi.fn((request: unknown, response: unknown) => ({ request, response })),
    }
    const middleware = {
      execute: vi.fn(async (request: unknown, response: unknown, next: () => Promise<unknown>) => {
        expect(request).toBe(req)
        expect(response).toBe(res)
        return await next()
      }),
    }

    const container = {
      resolve: vi.fn((token: string) => {
        if (token === 'HTTP_ADAPTER') return adapter
        if (token === TOKENS.MIDDLEWARE) return middleware
        return undefined
      }),
    } as unknown as IServiceContainer<TestRegistry>

    const result = await ContainerUtils.runExecute(
      res,
      req,
      container,
      async () => middlewareResponse as never,
    )

    expect(adapter.adapt).toHaveBeenCalledWith(req, res)
    expect(middleware.execute).toHaveBeenCalledTimes(1)
    expect(result).toBe(middlewareResponse)
  })
})
