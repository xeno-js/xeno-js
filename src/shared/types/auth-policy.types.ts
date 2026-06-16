/**
 * @description The AuthPolicy interface defines the structure of an authorization policy, which includes a list of roles and permissions. This interface is used to represent the access control policies associated with different intents or actions within the application. Implementations of this interface can be used to enforce role-based and permission-based access control by specifying which roles and permissions are required for specific operations.
 */
export interface AuthPolicy {
  /**
   * An array of roles that are associated with the authorization policy. These roles define the access level and permissions granted to users who possess them. The roles can be used to determine whether a user is authorized to perform certain actions or access specific resources within the application.
   */
  readonly roles: string[]
  /**
   * An array of permissions that are associated with the authorization policy. These permissions define the specific actions or operations that a user is allowed to perform within the application. The permissions can be used to enforce fine-grained access control by specifying which operations require certain permissions.
   */
  readonly permissions: string[]
}
