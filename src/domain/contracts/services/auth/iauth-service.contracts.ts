import type { AuthClaims } from '@/shared'

import type { ResultType } from '../../../results/result.types'

/**
 * @description IAuthService defines the contract for authentication services.
 * It provides methods to check if a user is authenticated and to retrieve the user's claims.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IAuthService {
  /**
   * Checks if the user is authenticated.
   * @returns A promise that resolves to true if the user is authenticated, false otherwise.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isAuthenticated(): Promise<boolean>
  /**
   * Authenticates a user based on a token.
   * @param token The token to authenticate the user.
   * @returns A promise that resolves to the user's claims, or null if not authenticated.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  authenticate(token: string): Promise<ResultType<AuthClaims>>
}
