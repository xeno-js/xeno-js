import type { ResultType } from '@/domain'
import type { AuthClaims } from '@/shared'

/**
 * @description IAuthService defines the contract for authentication services.
 * It provides methods to check if a user is authenticated and to retrieve the user's claims.
 */
export interface IAuthService {
  /**
   * Checks if the user is authenticated.
   * @returns A promise that resolves to true if the user is authenticated, false otherwise.
   */
  isAuthenticated(): Promise<boolean>
  /**
   * Authenticates a user based on a token.
   * @param token The token to authenticate the user.
   * @returns A promise that resolves to the user's claims, or null if not authenticated.
   */
  authenticate(token: string): Promise<ResultType<AuthClaims>>
}
