import type { IContextAccessor, IPolicyRegistry, IRequest, RequestContext } from '@xeno-js/shared'
import { ERROR_CODES } from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

const makePolicyRegistry = (userIdRequired?: string): IPolicyRegistry => ({
  getPolicy: vi.fn().mockReturnValue({
    userId: userIdRequired,
  }),
  addPolicy: vi.fn().mockReturnValue({}),
})

describe('UserAuthorizationStrategy', () => {
  let request: IRequest

  beforeEach(() => {
    request = makeRequest()
  })

  describe('execute — context guard (from base class)', () => {
    it('returns AUTHORIZATION_FAILED when getContext returns undefined', async () => {
      const ctx = {
        getContext: vi.fn().mockReturnValue(undefined),
      } as unknown as IContextAccessor<RequestContext>
      const policy = makePolicyRegistry()
      const strategy = new UserAuthorizationStrategy(policy, ctx)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when getContext returns null', async () => {
      const ctx = {
        getContext: vi.fn().mockReturnValue(null),
      } as unknown as IContextAccessor<RequestContext>
      const policy = makePolicyRegistry()
      const strategy = new UserAuthorizationStrategy(policy, ctx)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })
  })

  describe('performAuthorizationCheck — userId validation (no policy requirement)', () => {
    it('returns ok when policy does not require userId', async () => {
      const policy = makePolicyRegistry(undefined)
      const strategy = new UserAuthorizationStrategy(policy, makeRequestContext(undefined))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })

    it('returns ok when policy does not require userId even if auth has no userId', async () => {
      const policy = makePolicyRegistry(undefined)
      const strategy = new UserAuthorizationStrategy(policy, makeRequestContext(''))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })
  })

  describe('performAuthorizationCheck — userId validation (policy requires userId)', () => {
    it('returns AUTHORIZATION_FAILED when userId is undefined and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new UserAuthorizationStrategy(policy, makeRequestContext(undefined))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when userId is empty string and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new UserAuthorizationStrategy(policy, makeRequestContext(''))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when userId is not a valid GUID and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new UserAuthorizationStrategy(policy, makeRequestContext('not-a-guid'))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when userId is the empty GUID and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new UserAuthorizationStrategy(
        policy,
        makeRequestContext('00000000-0000-0000-0000-000000000000'),
      )

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when userId is a UUID v1 (not v4) and policy requires it', async () => {
      const uuidV1 = '550e8400-e29b-11d4-a716-446655440000'
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new UserAuthorizationStrategy(policy, makeRequestContext(uuidV1))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns ok when userId is a valid UUID v4 and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new UserAuthorizationStrategy(policy, makeRequestContext(VALID_GUID))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })
  })

  describe('performAuthorizationCheck — policy lookup', () => {
    it('calls policy.getPolicy with the correct intent', async () => {
      const getPolicy = vi.fn().mockReturnValue({
        userId: undefined,
      })
      const policy = {
        getPolicy,
        addPolicy: vi.fn().mockReturnValue({}),
      } as unknown as IPolicyRegistry
      const strategy = new UserAuthorizationStrategy(policy, makeRequestContext(VALID_GUID))
      const customRequest = makeRequest('CustomIntent')

      await strategy.execute(customRequest)

      expect(getPolicy).toHaveBeenCalledWith('CustomIntent')
    })
  })
})
