import type { AsyncLocalStorage } from 'node:async_hooks'

import type { IFactory, RequestContext } from '@xeno-js/shared'
import type { Guid } from '@xeno-js/shared'
import { describe, expect, it, vi } from 'vitest'

import type { ExecutionContext, IServiceScope } from '@/domain'

import type { XenoRegistry } from '../../xeno-registry'
import { NodeRequestContext } from '../request-context'

function makeStorage() {
  const runMock = vi.fn()
  const getStoreMock = vi.fn()

  const storage = {
    run: runMock,
    getStore: getStoreMock,
  } as unknown as AsyncLocalStorage<ExecutionContext<XenoRegistry>>

  return {
    storage,
    mocks: {
      runMock,
      getStoreMock,
    },
  }
}

function makeFactoryScope() {
  const disposeMock = vi.fn()
  const createMock = vi.fn().mockReturnValue({
    dispose: disposeMock,
  })

  const factoryScope = {
    create: createMock,
  } as unknown as IFactory<void, IServiceScope<XenoRegistry>>

  return {
    factoryScope,
    mocks: {
      createMock,
      disposeMock,
    },
  }
}

describe('NodeRequestContext', () => {
  it('runAsync delegates to AsyncLocalStorage.run and returns its result', async () => {
    const { storage, mocks } = makeStorage()
    const context: RequestContext = {
      identity: {
        userId: 'u1' as unknown as Guid,
        email: 'admin@example.com',
        name: 'admin',
        tenantId: 't1' as unknown as Guid,
        roles: ['admin'],
        permissions: ['read'],
      },
      network: {
        requestId: 'r1' as unknown as Guid,
        clientIp: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        formatIndicator: 'json',
        path: '/api/test',
        transport: undefined,
        csrf: '',
        csrfCookie: '',
        origin: '',
      },
      tracing: {
        correlationId: 'c1' as unknown as Guid,
        startTime: Date.now(),
        spanId: 's1',
        parentSpanId: 'ps1',
      },
      messaging: undefined,
    }

    const { factoryScope } = makeFactoryScope()
    mocks.runMock.mockImplementation((store, fn: () => Promise<string>) => fn())

    const requestContext = new NodeRequestContext(storage, factoryScope)
    const result = await requestContext.runAsync(context, async () => 'ok')

    expect(result).toBe('ok')
    expect(mocks.runMock).toHaveBeenCalledOnce()
    expect(mocks.runMock).toHaveBeenCalledWith(
      expect.objectContaining({ context }),
      expect.any(Function),
    )
  })

  it('getContext returns undefined when store is undefined', () => {
    const { storage, mocks } = makeStorage()
    mocks.getStoreMock.mockReturnValue(undefined)

    const requestContext = new NodeRequestContext(storage, makeFactoryScope().factoryScope)
    const result = requestContext.getContext()

    expect(result).toBeUndefined()
  })

  it('getContext returns undefined when store is null', () => {
    const { storage, mocks } = makeStorage()
    mocks.getStoreMock.mockReturnValue(null)

    const requestContext = new NodeRequestContext(storage, makeFactoryScope().factoryScope)
    const result = requestContext.getContext()

    expect(result).toBeUndefined()
  })

  it('getContext returns a frozen cloned object when store exists', () => {
    const { storage, mocks } = makeStorage()
    const original: RequestContext = {
      identity: {
        userId: 'u1' as unknown as Guid,
        email: 'admin@example.com',
        name: 'admin',
        tenantId: 't1' as unknown as Guid,
        roles: ['admin'],
        permissions: [],
      },
      network: {
        clientIp: '',
        userAgent: '',
        formatIndicator: '',
        path: '',
        requestId: '' as unknown as Guid,
        transport: undefined,
        csrf: '',
        csrfCookie: '',
        origin: '',
      },
      tracing: {
        correlationId: '' as unknown as Guid,
        spanId: '',
        parentSpanId: undefined,
        startTime: 0,
      },
    }

    mocks.getStoreMock.mockReturnValue({
      context: original,
      scope: {} as IServiceScope<XenoRegistry>,
    })

    const requestContext = new NodeRequestContext(storage, makeFactoryScope().factoryScope)
    const result = requestContext.getContext()

    expect(result?.identity).toEqual(original.identity)
    expect(result?.identity).not.toBe(original)
    expect(Object.isFrozen(result)).toBe(true)
  })
})
