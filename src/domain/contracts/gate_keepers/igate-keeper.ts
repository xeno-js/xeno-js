import type { Identity, ResultType } from '@/domain'
import type { Optional } from '@/shared'

/**
 * @description Interface representing a gatekeeper responsible for handling authentication and authorization in the application. The IGateKeeper interface defines two methods: authenticate, which takes a token as input and returns a ResultType containing the authenticated Identity if successful, or an error if authentication fails; and authorize, which takes an Identity and a permission string as input and returns a boolean indicating whether the identity has the specified permission. This interface serves as a contract for implementing authentication and authorization logic in the application, allowing for flexibility in how these concerns are handled while ensuring consistency across different implementations.
 */
export interface IGateKeeper {
  /**
   * @description Authenticates a user based on the provided token. This method takes a token as input and attempts to validate it against the authentication mechanism in place (e.g., JWT, OAuth). If the token is valid and corresponds to an authenticated user, it returns a ResultType containing the Identity of the authenticated user. If authentication fails (e.g., due to an invalid token, expired token, or other authentication issues), it returns a ResultType containing an appropriate error describing the reason for the failure.
   * @param token The authentication token provided by the client, which is used to identify and authenticate the user. This could be a JWT, OAuth token, or any other form of authentication credential depending on the implementation.
   * @returns A ResultType containing either the authenticated Identity if successful or an error if authentication fails.
   */
  authenticate(token: string): Promise<ResultType<Optional<Identity>>>

  /**
   * @description Authorizes a user based on their Identity and the required permission. This method takes an Identity object representing the authenticated user and a permission string that specifies the required permission for a particular action or resource. It checks whether the provided Identity has the necessary permissions to perform the action or access the resource in question. The method returns a boolean value indicating whether the authorization check passed (true) or failed (false), allowing the application to enforce access control based on user permissions.
   * @param identity The Identity of the authenticated user for whom the authorization check is being performed. This object typically contains information about the user's roles, permissions, and other relevant attributes that can be used to determine their access rights.
   * @param permission A string representing the specific permission required to perform an action or access a resource. This could be a role name, a specific permission identifier, or any other form of access control descriptor depending on the application's authorization model.
   * @returns A boolean value indicating whether the provided Identity has the required permission (true) or not (false), allowing the application to enforce access control based on user permissions.
   */
  authorize(identity: Identity, permission: string): Promise<boolean>
}
