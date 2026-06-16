import { describe, expect, it, vi } from 'vitest'

import type { ExecutionContext, ICache, IRequestContext } from '@/domain'
import { IDEMPOTENCY_CONSTANTS } from '@/shared'

import { IdempotencyStore } from '../idempotency-store'

function makeStore(executionContext: ExecutionContext | undefined) {
  const setIfAbsentMock = vi.fn()
  const hasMock = vi.fn()
  const setMock = vi.fn()
  const getMock = vi.fn()
  const removeMock = vi.fn()

  const getContextMock = vi.fn().mockReturnValue(executionContext)

  const cache = {
    setIfAbsent: setIfAbsentMock,
    has: hasMock,
    set: setMock,
    get: getMock,
    remove: removeMock,
  } as unknown as ICache

  const requestContext = {
    getContext: getContextMock,
    runAsync: vi.fn(),
  } as unknown as IRequestContext<ExecutionContext>

  const store = new IdempotencyStore(cache, requestContext)

  return {
    store,
    mocks: {
      setIfAbsentMock,
      hasMock,
      setMock,
      getMock,
      removeMock,
      getContextMock,
    },
  }
}

describe('IdempotencyStore', () => {
  it('acquireLock uses tenant contextual key and returns cache result', async () => {
    const executionContext = {
      context: {
        identity: {
          userId: '550e8400-e29b-41d4-a716-446655440001',
          tenantId: '550e8400-e29b-41d4-a716-446655440002',
          roles: ['admin'],
          permissions: ['write'],
        },
      },
    } as unknown as ExecutionContext

    const { store, mocks } = makeStore(executionContext)
    mocks.setIfAbsentMock.mockResolvedValue(true)

    const result = await store.acquireLock('req-1', 60)

    expect(result).toBe(true)
    expect(mocks.getContextMock).toHaveBeenCalled()
    expect(mocks.setIfAbsentMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.LOCK_KEY_PREFIX}tenant:${executionContext.context.identity.tenantId}:commands:req-1`,
      IDEMPOTENCY_CONSTANTS.LOCKED_VALUE,
      60,
    )
  })

  it('hasBeenProcessed falls back to non-tenant key when tenantId is empty', async () => {
    const executionContext = {
      context: {
        identity: {
          userId: '550e8400-e29b-41d4-a716-446655440001',
          tenantId: undefined,
          roles: ['user'],
          permissions: ['read'],
        },
      },
    } as unknown as ExecutionContext

    const { store, mocks } = makeStore(executionContext)
    mocks.hasMock.mockResolvedValue(false)

    const result = await store.hasBeenProcessed('cmd-1')

    expect(result).toBe(false)
    expect(mocks.hasMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}commands:cmd-1`,
    )
  })

  it('markAsProcessed stores payload with processed key prefix and ttl', async () => {
    const { store, mocks } = makeStore(undefined)
    const payload = { ok: true, attempt: 1 }

    await store.markAsProcessed('cmd-2', payload, 120)

    expect(mocks.setMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}commands:cmd-2`,
      payload,
      120,
    )
  })

  it('getPayload returns cached payload for processed key', async () => {
    const { store, mocks } = makeStore(undefined)
    const payload = { value: 'cached' }
    mocks.getMock.mockResolvedValue(payload)

    const result = await store.getPayload<typeof payload>('cmd-3')

    expect(result).toEqual(payload)
    expect(mocks.getMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}commands:cmd-3`,
    )
  })

  it('releaseLock removes lock key from cache', async () => {
    const { store, mocks } = makeStore(undefined)

    await store.releaseLock('cmd-4')

    expect(mocks.removeMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.LOCK_KEY_PREFIX}commands:cmd-4`,
    )
  })
})
