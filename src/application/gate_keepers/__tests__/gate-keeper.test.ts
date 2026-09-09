import type { IAuthService, IBaseMapper, Identity } from '@xeno-js/shared'
import type { AuthClaims } from '@xeno-js/shared'
import { AppError, Result } from '@xeno-js/shared'
import { GUEST, STATUS_CODES } from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GateKeeper } from '../gate-keeper'

const VALID_CLAIMS = { sub: 'user-1', tenantId: 'tenant-1' } as unknown as AuthClaims
const VALID_IDENTITY: Identity = {
  userId: 'user-1',
  tenantId: 'tenant-1',
  roles: [],
  permissions: [],
} as unknown as Identity

describe('GateKeeper', () => {
  let authenticate: ReturnType<typeof vi.fn>
  let map: ReturnType<typeof vi.fn>
  let authService: IAuthService
  let mapper: IBaseMapper<AuthClaims, Identity>

  beforeEach(() => {
    authenticate = vi.fn()
    map = vi.fn().mockReturnValue(VALID_IDENTITY)
    authService = { authenticate } as unknown as IAuthService
    mapper = { map } as unknown as IBaseMapper<AuthClaims, Identity>
  })

  describe('authenticate — no token (early return GUEST)', () => {
    it('returns GUEST when token is undefined', async () => {
      const gk = new GateKeeper(authService, mapper)
      const result = await gk.authenticate(undefined)

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toEqual(GUEST)
      expect(authenticate).not.toHaveBeenCalled()
    })

    it('returns GUEST when token is null', async () => {
      const gk = new GateKeeper(authService, mapper)
      const result = await gk.authenticate(null as unknown as string)

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toEqual(GUEST)
    })

    it('returns GUEST when token is empty string', async () => {
      const gk = new GateKeeper(authService, mapper)
      const result = await gk.authenticate('')

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toEqual(GUEST)
    })
  })

  describe('authenticate — authService returns error', () => {
    it('returns fail with the authService error', async () => {
      const error = AppError.create({
        code: 'AUTH_FAILED',
        message: 'bad token',
        status: STATUS_CODES.UNAUTHORIZED,
        name: 'Authenticate',
        cause: new Error('bad token'),
      })
      authenticate.mockResolvedValue(Result.fail(error))
      const gk = new GateKeeper(authService, mapper)

      const result = await gk.authenticate('bad-token')

      expect(result.isOk()).toBe(false)
      expect(result.getErrorOrThrow().code).toBe('AUTH_FAILED')
    })
  })

  describe('authenticate — authService succeeds', () => {
    it('returns GUEST when claims is null', async () => {
      authenticate.mockResolvedValue(Result.ok(null))
      const gk = new GateKeeper(authService, mapper)

      const result = await gk.authenticate('valid-token')

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toEqual(GUEST)
    })

    it('returns GUEST when claims is empty string', async () => {
      authenticate.mockResolvedValue(Result.ok(''))
      const gk = new GateKeeper(authService, mapper)

      const result = await gk.authenticate('valid-token')

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toEqual(GUEST)
    })

    it('maps claims and returns identity when claims are valid', async () => {
      authenticate.mockResolvedValue(Result.ok(VALID_CLAIMS))
      const gk = new GateKeeper(authService, mapper)

      const result = await gk.authenticate('valid-token')

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toBe(VALID_IDENTITY)
      expect(map).toHaveBeenCalledWith(VALID_CLAIMS)
    })
  })
})
