import type { Optional } from '@/shared'

import type { Identity } from '../../contracts/context/context_types/identity-context.types'
import type { ResultType } from '../../results/result.types'

/**
 * @description IGateKeeper defines the contract for gatekeeper services responsible for authorizing users based on their identity and permissions. It provides a method to check if a user has a specific permission, taking into account their roles and permissions. The authorize method checks if the user's permissions include the required permission or if they have a role that grants them access (e.g., SUPER_ADMIN or ADMIN). If the user does not have the necessary permissions, it returns false.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IGateKeeper {
  /**
   * Authenticates a user based on a provided token and returns their identity.
   * @param token The authentication token to validate and extract the user's identity from.
   * @returns A promise that resolves to the user's identity if authentication is successful, or an error if it fails.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  authenticate(token: Optional<string>): Promise<ResultType<Identity>>
}
