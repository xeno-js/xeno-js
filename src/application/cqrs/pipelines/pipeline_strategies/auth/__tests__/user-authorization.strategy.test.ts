import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { IContextAccessor, IRequest, RequestContext } from '@/domain'
import { ERROR_CODES } from '@/shared'

import { UserAuthorizationStrategy } from '../user-authorization.strategy'

const VALID_GUID = '550e8400-e29b-41d4-a716-446655440000'

const makeRequest = (intent = 'TestCommand'): IRequest =>
  ({ intent, type: 'COMMAND', signal: undefined, isPublic: false }) as unknown as IRequest

const makeRequestContext = (userId?: string): IContextAccessor<RequestContext> => ({
  getContext: vi.fn().mockReturnValue({
    identity: {
      userId,
      tenantId: 'tenant-1',
      roles: [],
      permissions: [],
    },
    network: { requestId: 'req-1' },
    tracing: {},
  }),
})

describe('UserAuthorizationStrategy', () => {
  let request: IRequest

  beforeEach(() => {
    request = makeRequest()
  })

  describe('execute � context guard (from base class)', () => {
    it('returns AUTHORIZATION_FAILED when getContext returns undefined', async () => {
      const ctx = {
        getContext: vi.fn().mockReturnValue(undefined),
      } as unknown as IContextAccessor<RequestContext>
      const strategy = new UserAuthorizationStrategy(ctx)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when getContext returns null', async () => {
      const ctx = {
        getContext: vi.fn().mockReturnValue(null),
      } as unknown as IContextAccessor<RequestContext>
      const strategy = new UserAuthorizationStrategy(ctx)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })
  })

  describe('performAuthorizationCheck � userId validation', () => {
    it('returns AUTHORIZATION_FAILED when userId is undefined', async () => {
      const strategy = new UserAuthorizationStrategy(makeRequestContext(undefined))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when userId is empty string', async () => {
      const strategy = new UserAuthorizationStrategy(makeRequestContext(''))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when userId is not a valid GUID', async () => {
      const strategy = new UserAuthorizationStrategy(makeRequestContext('not-a-guid'))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when userId is the empty GUID', async () => {
      const strategy = new UserAuthorizationStrategy(
        makeRequestContext('00000000-0000-0000-0000-000000000000'),
      )

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when userId is a UUID v1 (not v4)', async () => {
      const uuidV1 = '550e8400-e29b-11d4-a716-446655440000'
      const strategy = new UserAuthorizationStrategy(makeRequestContext(uuidV1))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns ok when userId is a valid UUID v4', async () => {
      const strategy = new UserAuthorizationStrategy(makeRequestContext(VALID_GUID))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })
  })
})
