import type { SupabaseClient, User } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { IBaseMapper } from '@/domain'
import { AppError } from '@/domain'
import type { AuthClaims } from '@/shared'
import { ERROR_CODES, STATUS_CODES } from '@/shared'

import { SupabaseAuthService } from '../supabase-auth.service'

describe('SupabaseAuthService', () => {
  const getUserMock = vi.fn()
  const getSessionMock = vi.fn()
  const mapMock = vi.fn()

  let mockSupabaseClient: SupabaseClient
  let mockMapper: IBaseMapper<User, AuthClaims>
  let sut: SupabaseAuthService

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabaseClient = {
      auth: {
        getUser: getUserMock,
        getSession: getSessionMock,
      },
    } as unknown as SupabaseClient

    mockMapper = {
      map: mapMock,
    }

    sut = new SupabaseAuthService(mockSupabaseClient, mockMapper)
  })

  // ─── Test Suite: authenticate ──────────────────────────────────────────────
  describe('authenticate', () => {
    const fakeToken = 'valid-supabase-jwt-token'

    it('should return a failed Result containing a standardized AppError when Supabase auth returns an error', async () => {
      // Arrange
      const supabaseError = { message: 'Auth token has expired' }
      getUserMock.mockResolvedValue({
        data: { user: null },
        error: supabaseError,
      })

      // Act
      const result = await sut.authenticate(fakeToken)

      // Assert
      expect(getUserMock).toHaveBeenCalledOnce()
      expect(getUserMock).toHaveBeenCalledWith(fakeToken)
      expect(result.isOk()).toBe(false)

      const error = result.getErrorOrThrow()
      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe(ERROR_CODES.AUTHENTICATION_FAILED)
      expect(error.status).toBe(STATUS_CODES.UNAUTHORIZED)
      expect(error.cause).toBe('Auth token has expired')
    })

    it('should fall back to "Unknown error" when Supabase error message is missing or undefined', async () => {
      // Arrange
      getUserMock.mockResolvedValue({
        data: { user: null },
        error: { message: undefined }, // Errore definito ma senza messaggio esplicito
      })

      // Act
      const result = await sut.authenticate(fakeToken)

      // Assert
      expect(result.isOk()).toBe(false)
      const error = result.getErrorOrThrow()
      expect(error.cause).toBe('Unknown error')
    })

    it('should return a failed Result if Supabase returns no error but the user object is undefined', async () => {
      // Arrange
      getUserMock.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      // Act
      const result = await sut.authenticate(fakeToken)

      // Assert
      expect(result.isOk()).toBe(false)
      const error = result.getErrorOrThrow()
      expect(error.cause).toBe('Unknown error')
    })

    it('should map the user to claims and return a successful Result when authentication succeeds', async () => {
      // Arrange
      const fakeUser = { id: 'usr-456', email: 'user@XenoJS.it' } as User
      const expectedClaims: AuthClaims = {
        sub: 'usr-456',
        tenantId: 'tenant-789',
        roles: ['USER'],
        permissions: ['read:items'],
      }

      getUserMock.mockResolvedValue({
        data: { user: fakeUser },
        error: null,
      })
      mapMock.mockReturnValue(expectedClaims)

      // Act
      const result = await sut.authenticate(fakeToken)

      // Assert
      expect(getUserMock).toHaveBeenCalledWith(fakeToken)
      expect(mapMock).toHaveBeenCalledOnce()
      expect(mapMock).toHaveBeenCalledWith(fakeUser)

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toEqual(expectedClaims)
    })
  })

  // ─── Test Suite: isAuthenticated ───────────────────────────────────────────
  describe('isAuthenticated', () => {
    it('should return true when an active session exists in Supabase context', async () => {
      // Arrange
      const fakeSession = { id: 'session-active-abc' }
      getSessionMock.mockResolvedValue({
        data: { session: fakeSession },
      })

      // Act
      const isAuth = await sut.isAuthenticated()

      // Assert
      expect(getSessionMock).toHaveBeenCalledOnce()
      expect(isAuth).toBe(true)
    })

    it('should return false when session is null or undefined', async () => {
      // Arrange
      getSessionMock.mockResolvedValue({
        data: { session: null },
      })

      // Act
      const isAuth = await sut.isAuthenticated()

      // Assert
      expect(getSessionMock).toHaveBeenCalledOnce()
      expect(isAuth).toBe(false)
    })
  })
})
