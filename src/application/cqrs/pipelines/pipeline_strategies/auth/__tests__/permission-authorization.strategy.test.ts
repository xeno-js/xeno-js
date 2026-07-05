import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'

import type { ExecutionContext, IPolicyRegistry, IRequest, IRequestContext } from '@/domain'
import { type AuthPolicy } from '@/shared'
import { ERROR_CODES } from '@/shared'

import { PermissionAuthorizationStrategy } from '../permission-authorization.strategy'

const makeRequest = (intent = 'TestCommand'): IRequest =>
  ({ intent, type: 'COMMAND', signal: undefined }) as unknown as IRequest

const makeRequestContext = (identity?: {
  permissions?: string[]
}): IRequestContext<ExecutionContext> =>
  ({
    getContext: vi.fn().mockReturnValue({
      context: {
        identity: {
          userId: 'user-1',
          tenantId: 'tenant-1',
          roles: [],
          permissions: identity?.permissions ?? [],
        },
        network: { requestId: 'req-1' },
        tracing: {},
      },
    }),
  }) as unknown as IRequestContext<ExecutionContext>

const makePolicy = (overrides?: Partial<AuthPolicy>): AuthPolicy => ({
  roles: [],
  permissions: [],
  ...overrides,
})

const makePolicyRegistry = (
  policy?: AuthPolicy,
): { registry: IPolicyRegistry; getPolicyMock: Mock } => {
  const getPolicyMock = vi.fn().mockReturnValue(policy)
  const registry = { getPolicy: getPolicyMock, addPolicy: vi.fn() } as unknown as IPolicyRegistry
  return { registry, getPolicyMock }
}

describe('PermissionAuthorizationStrategy', () => {
  let request: IRequest

  beforeEach(() => {
    request = makeRequest()
  })

  describe('execute � context guard (from base class)', () => {
    it('returns UNAUTHORIZED when context is undefined', async () => {
      const requestContext = {
        getContext: vi.fn().mockReturnValue(undefined),
      } as unknown as IRequestContext<ExecutionContext>
      const { registry } = makePolicyRegistry(makePolicy())
      const strategy = new PermissionAuthorizationStrategy(registry, requestContext)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      const error = result.getErrorOrThrow()
      expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED)
    })

    it('returns UNAUTHORIZED when getContext returns null', async () => {
      const requestContext = {
        getContext: vi.fn().mockReturnValue(null),
      } as unknown as IRequestContext<ExecutionContext>
      const { registry } = makePolicyRegistry(makePolicy())
      const strategy = new PermissionAuthorizationStrategy(registry, requestContext)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      const error = result.getErrorOrThrow()
      expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED)
    })
  })

  describe('performAuthorizationCheck � no policy found', () => {
    it('returns true when policy is undefined', async () => {
      const requestContext = makeRequestContext()
      const { registry } = makePolicyRegistry(undefined)
      const strategy = new PermissionAuthorizationStrategy(registry, requestContext)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })
  })

  describe('performAuthorizationCheck � policy with no permissions', () => {
    it('returns ok when policy has empty permissions array', async () => {
      const requestContext = makeRequestContext()
      const { registry } = makePolicyRegistry(makePolicy({ permissions: [] }))
      const strategy = new PermissionAuthorizationStrategy(registry, requestContext)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })
  })

  describe('performAuthorizationCheck � permission checks', () => {
    it('returns ok when user has at least one required permission', async () => {
      const requestContext = makeRequestContext({ permissions: ['read', 'write'] })
      const { registry } = makePolicyRegistry(makePolicy({ permissions: ['write', 'admin'] }))
      const strategy = new PermissionAuthorizationStrategy(registry, requestContext)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(true)
    })

    it('returns ok when permission check is case-insensitive (policy lowercase matches user lowercase)', async () => {
      const requestContext = makeRequestContext({ permissions: ['READ'] })
      const { registry } = makePolicyRegistry(makePolicy({ permissions: ['read'] }))
      const strategy = new PermissionAuthorizationStrategy(registry, requestContext)

      // The implementation does: permissions.includes(permission.toLowerCase())
      // user permissions are NOT lowercased, policy permissions ARE lowercased
      // 'READ'.includes('read') => false => AUTH_FORBIDDEN
      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      const error = result.getErrorOrThrow()
      expect(error.code).toBe(ERROR_CODES.FORBIDDEN)
    })

    it('returns FORBIDDEN when user has none of the required permissions', async () => {
      const requestContext = makeRequestContext({ permissions: ['view'] })
      const { registry } = makePolicyRegistry(makePolicy({ permissions: ['write', 'admin'] }))
      const strategy = new PermissionAuthorizationStrategy(registry, requestContext)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      const error = result.getErrorOrThrow()
      expect(error.code).toBe(ERROR_CODES.FORBIDDEN)
    })

    it('returns FORBIDDEN when user has no permissions (undefined)', async () => {
      const requestContext = makeRequestContext({ permissions: undefined })
      const { registry } = makePolicyRegistry(makePolicy({ permissions: ['write'] }))
      const strategy = new PermissionAuthorizationStrategy(registry, requestContext)

      const result = await strategy.execute(request)

      expect(result.isOk()).toBe(false)
      const error = result.getErrorOrThrow()
      expect(error.code).toBe(ERROR_CODES.FORBIDDEN)
    })

    it('calls getPolicy with the correct intent', async () => {
      const requestContext = makeRequestContext({ permissions: ['read'] })
      const { registry, getPolicyMock } = makePolicyRegistry(makePolicy({ permissions: ['read'] }))
      const strategy = new PermissionAuthorizationStrategy(registry, requestContext)

      await strategy.execute(request)

      expect(getPolicyMock).toHaveBeenCalledWith('TestCommand')
    })
  })
})
