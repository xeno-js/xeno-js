import { describe, expect, it, vi } from 'vitest'

import type { ICache, ICacheKeyBuilder } from '@/domain'
import { IDEMPOTENCY_CONSTANTS } from '@/shared'

import { IdempotencyStore } from '../idempotency-store'

function makeStore() {
  const setIfAbsentMock = vi.fn()
  const hasMock = vi.fn()
  const setMock = vi.fn()
  const getMock = vi.fn()
  const removeMock = vi.fn()

  const cache = {
    setIfAbsent: setIfAbsentMock,
    has: hasMock,
    set: setMock,
    get: getMock,
    remove: removeMock,
  } as unknown as ICache

  const createCacheKeyBuilder = () => {
    const buildContextualKeyMock = vi.fn((key: string) => `contextual:${key}`)
    const buildUserScopedKeyMock = vi.fn((key: string) => `user-scoped:${key}`)
    const cacheKeyBuilder: ICacheKeyBuilder = {
      buildContextualKey: buildContextualKeyMock,
      buildUserScopedKey: buildUserScopedKeyMock,
    }
    return { cacheKeyBuilder, buildContextualKeyMock, buildUserScopedKeyMock }
  }

  const { cacheKeyBuilder } = createCacheKeyBuilder()
  const store = new IdempotencyStore(cache, cacheKeyBuilder)

  return {
    store,
    mocks: {
      setIfAbsentMock,
      hasMock,
      setMock,
      getMock,
      removeMock,
    },
  }
}

describe('IdempotencyStore', () => {
  it('acquireLock uses contextual key and returns cache result', async () => {
    const { store, mocks } = makeStore()
    mocks.setIfAbsentMock.mockResolvedValue(true)

    const result = await store.acquireLock('req-1', 60)

    expect(result).toBe(true)
    expect(mocks.setIfAbsentMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.LOCK_KEY_PREFIX}contextual:command:req-1`,
      IDEMPOTENCY_CONSTANTS.LOCKED_VALUE,
      60,
    )
  })

  it('hasBeenProcessed uses contextual key', async () => {
    const { store, mocks } = makeStore()
    mocks.hasMock.mockResolvedValue(false)

    const result = await store.hasBeenProcessed('cmd-1')

    expect(result).toBe(false)
    expect(mocks.hasMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}contextual:command:cmd-1`,
    )
  })

  it('markAsProcessed stores payload with processed key prefix and ttl', async () => {
    const { store, mocks } = makeStore()
    const payload = { ok: true, attempt: 1 }

    await store.markAsProcessed('cmd-2', payload, 120)

    expect(mocks.setMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}contextual:command:cmd-2`,
      payload,
      120,
    )
  })

  it('getPayload returns cached payload for processed key', async () => {
    const { store, mocks } = makeStore()
    const payload = { value: 'cached' }
    mocks.getMock.mockResolvedValue(payload)

    const result = await store.getPayload<typeof payload>('cmd-3')

    expect(result).toEqual(payload)
    expect(mocks.getMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}contextual:command:cmd-3`,
    )
  })

  it('releaseLock removes lock key from cache', async () => {
    const { store, mocks } = makeStore()

    await store.releaseLock('cmd-4')

    expect(mocks.removeMock).toHaveBeenCalledWith(
      `${IDEMPOTENCY_CONSTANTS.LOCK_KEY_PREFIX}contextual:command:cmd-4`,
    )
  })
})
