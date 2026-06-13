import type { AsyncLocalStorage } from 'node:async_hooks'

import { describe, expect, it, vi } from 'vitest'

import { NodeRequestContext } from '../request-context'

interface Ctx {
  userId: string
  role: string
}

function makeStorage() {
  const runMock = vi.fn()
  const getStoreMock = vi.fn()

  const storage = {
    run: runMock,
    getStore: getStoreMock,
  } as unknown as AsyncLocalStorage<Ctx>

  return {
    storage,
    mocks: {
      runMock,
      getStoreMock,
    },
  }
}

describe('NodeRequestContext', () => {
  it('runAsync delegates to AsyncLocalStorage.run and returns its result', async () => {
    const { storage, mocks } = makeStorage()
    const context: Ctx = { userId: 'u1', role: 'admin' }

    mocks.runMock.mockImplementation(async (_ctx: Ctx, fn: () => Promise<string>) => fn())

    const requestContext = new NodeRequestContext(storage)
    const result = await requestContext.runAsync(context, async () => 'ok')

    expect(result).toBe('ok')
    expect(mocks.runMock).toHaveBeenCalledOnce()
    expect(mocks.runMock).toHaveBeenCalledWith(context, expect.any(Function))
  })

  it('getContext returns undefined when store is undefined', () => {
    const { storage, mocks } = makeStorage()
    mocks.getStoreMock.mockReturnValue(undefined)

    const requestContext = new NodeRequestContext(storage)
    const result = requestContext.getContext()

    expect(result).toBeUndefined()
  })

  it('getContext returns undefined when store is null', () => {
    const { storage, mocks } = makeStorage()
    mocks.getStoreMock.mockReturnValue(null)

    const requestContext = new NodeRequestContext(storage)
    const result = requestContext.getContext()

    expect(result).toBeUndefined()
  })

  it('getContext returns a frozen cloned object when store exists', () => {
    const { storage, mocks } = makeStorage()
    const original: Ctx = { userId: 'u1', role: 'admin' }
    mocks.getStoreMock.mockReturnValue(original)

    const requestContext = new NodeRequestContext(storage)
    const result = requestContext.getContext()

    expect(result).toEqual(original)
    expect(result).not.toBe(original)
    expect(Object.isFrozen(result)).toBe(true)
  })
})
