import type { AuthPolicy, Optional } from '@/shared'

/**
 * @description The IPolicyRegistry interface defines the contract for a Policy registry that manages role-based access control policies. It provides methods to add policies for certain intents and to retrieve the access control policy for a given intent. Implementations of this interface can be used to enforce Policy policies across the application by associating roles and permissions with specific actions or intents.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IPolicyRegistry {
  /**
   * @description Adds a policy for a specific intent. If a policy for the intent already exists, it will be updated with the new roles and permissions.
   * @param intent - The intent for which the policy is being added.
   * @param policy - The policy to be added.
   * @returns The current instance of the policy registry.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  addPolicy(intent: string, policy: AuthPolicy): this

  /**
   * @description Retrieves the policy for a specific intent.
   * @param intent - The intent for which the policy is being retrieved.
   * @returns The policy associated with the intent, or undefined if no policy exists.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  getPolicy(intent: string): Optional<AuthPolicy>
}
