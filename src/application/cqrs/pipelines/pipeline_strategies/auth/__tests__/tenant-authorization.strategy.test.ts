import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ExecutionContext, IRequest, IRequestContext } from '@/domain'
import { ERROR_CODES } from '@/shared'

import { TenantAuthorizationStrategy } from '../tenant-authorization.strategy'

const VALID_GUID = '550e8400-e29b-41d4-a716-446655440000'

const makeRequest = (intent = 'TestCommand'): IRequest =>
  ({ intent, type: 'COMMAND', signal: undefined }) as unknown as IRequest

const makeRequestContext = (tenantId?: string): IRequestContext<ExecutionContext> =>
  ({
    getContext: vi.fn().mockReturnValue({
      context: {
        identity: {
          userId: 'user-1',
          tenantId,
          roles: [],
          permissions: [],
        },
        network: { requestId: 'req-1' },
        tracing: {},
      },
    }),
  }) as unknown as IRequestContext<ExecutionContext>

describe('TenantAuthorizationStrategy', () => {
  let request: IRequest

  beforeEach(() => {
    request = makeRequest()
  })

  describe('execute � context guard (from base class)', () => {
    it('returns AUTHORIZATION_FAILED when getContext returns undefined', async () => {
      const ctx = {
        getContext: vi.fn().mockReturnValue(undefined),
      } as unknown as IRequestContext<ExecutionContext>
      const strategy = new TenantAuthorizationStrategy(ctx)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when getContext returns null', async () => {
      const ctx = {
        getContext: vi.fn().mockReturnValue(null),
      } as unknown as IRequestContext<ExecutionContext>
      const strategy = new TenantAuthorizationStrategy(ctx)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })
  })

  describe('performAuthorizationCheck � tenantId validation', () => {
    it('returns true when tenantId is undefined', async () => {
      const strategy = new TenantAuthorizationStrategy(makeRequestContext(undefined))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })

    it('returns AUTHORIZATION_FAILED when tenantId is empty string', async () => {
      const strategy = new TenantAuthorizationStrategy(makeRequestContext(''))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when tenantId is not a valid GUID', async () => {
      const strategy = new TenantAuthorizationStrategy(makeRequestContext('not-a-guid'))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when tenantId is the empty GUID', async () => {
      const strategy = new TenantAuthorizationStrategy(
        makeRequestContext('00000000-0000-0000-0000-000000000000'),
      )

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when tenantId is a UUID v1 (not v4)', async () => {
      // UUID v1 � version nibble is 1, not 4
      const uuidV1 = '550e8400-e29b-11d4-a716-446655440000'
      const strategy = new TenantAuthorizationStrategy(makeRequestContext(uuidV1))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns ok when tenantId is a valid UUID v4', async () => {
      const strategy = new TenantAuthorizationStrategy(makeRequestContext(VALID_GUID))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })
  })
})
