import type { IContextAccessor, IPolicyRegistry, IRequest, RequestContext } from '@xeno-js/shared'
import { ERROR_CODES } from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TenantAuthorizationStrategy } from '../tenant-authorization.strategy'

const VALID_GUID = '550e8400-e29b-41d4-a716-446655440000'

const makeRequest = (intent = 'TestCommand'): IRequest =>
  ({ intent, type: 'COMMAND', signal: undefined }) as unknown as IRequest

const makeRequestContext = (tenantId?: string): IContextAccessor<RequestContext> => ({
  getContext: vi.fn().mockReturnValue({
    identity: {
      userId: 'user-1',
      tenantId,
      roles: [],
      permissions: [],
    },
    network: { requestId: 'req-1' },
    tracing: {},
  }),
})

const makePolicyRegistry = (tenantIdRequired?: string): IPolicyRegistry => ({
  getPolicy: vi.fn().mockReturnValue({
    tenantId: tenantIdRequired,
  }),
  addPolicy: vi.fn().mockReturnValue({}),
})

describe('TenantAuthorizationStrategy', () => {
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
      const strategy = new TenantAuthorizationStrategy(policy, ctx)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when getContext returns null', async () => {
      const ctx = {
        getContext: vi.fn().mockReturnValue(null),
      } as unknown as IContextAccessor<RequestContext>
      const policy = makePolicyRegistry()
      const strategy = new TenantAuthorizationStrategy(policy, ctx)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })
  })

  describe('performAuthorizationCheck — tenantId validation (no policy requirement)', () => {
    it('returns ok when policy does not require tenantId', async () => {
      const policy = makePolicyRegistry(undefined)
      const strategy = new TenantAuthorizationStrategy(policy, makeRequestContext(undefined))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })

    it('returns ok when policy does not require tenantId even if auth has no tenantId', async () => {
      const policy = makePolicyRegistry(undefined)
      const strategy = new TenantAuthorizationStrategy(policy, makeRequestContext(''))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })
  })

  describe('performAuthorizationCheck — tenantId validation (policy requires tenantId)', () => {
    it('returns AUTHORIZATION_FAILED when tenantId is undefined and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new TenantAuthorizationStrategy(policy, makeRequestContext(undefined))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when tenantId is empty string and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new TenantAuthorizationStrategy(policy, makeRequestContext(''))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when tenantId is not a valid GUID and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new TenantAuthorizationStrategy(policy, makeRequestContext('not-a-guid'))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when tenantId is the empty GUID and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new TenantAuthorizationStrategy(
        policy,
        makeRequestContext('00000000-0000-0000-0000-000000000000'),
      )

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns AUTHORIZATION_FAILED when tenantId is a UUID v1 (not v4) and policy requires it', async () => {
      const uuidV1 = '550e8400-e29b-11d4-a716-446655440000'
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new TenantAuthorizationStrategy(policy, makeRequestContext(uuidV1))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns ok when tenantId is a valid UUID v4 and policy requires it', async () => {
      const policy = makePolicyRegistry(VALID_GUID)
      const strategy = new TenantAuthorizationStrategy(policy, makeRequestContext(VALID_GUID))

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })
  })

  describe('performAuthorizationCheck — policy lookup', () => {
    it('calls policy.getPolicy with the correct intent', async () => {
      const getPolicy = vi.fn().mockReturnValue({
        tenantId: undefined,
      })
      const policy = {
        getPolicy,
        addPolicy: vi.fn().mockReturnValue({}),
      } as unknown as IPolicyRegistry
      const strategy = new TenantAuthorizationStrategy(policy, makeRequestContext(VALID_GUID))
      const customRequest = makeRequest('CustomIntent')

      await strategy.execute(customRequest)

      expect(getPolicy).toHaveBeenCalledWith('CustomIntent')
    })
  })
})
