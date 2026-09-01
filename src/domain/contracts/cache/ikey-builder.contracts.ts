/**
 * @interface ICacheKeyBuilder
 * @description Interface for building cache keys with contextual information.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface ICacheKeyBuilder {
  /**
   * @description Builds a contextual cache key based on the provided key and the current user's identity. If a tenant ID is present in the identity, the cache key is prefixed with the tenant ID; otherwise, it defaults to a public cache key. This method ensures that cached data is appropriately scoped to the user's context, preventing data leakage between tenants.
   * @param key The base key to be used for building the contextual cache key.
   * @returns The contextual cache key.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  buildContextualKey(key: string): string

  /**
   * @description Builds a user-scoped cache key based on the provided key and the current user's identity. If a user ID is present in the identity, the cache key is prefixed with the user ID; otherwise, it defaults to a public cache key. This method ensures that cached data is appropriately scoped to the user's context, preventing data leakage between users.
   * @param key The base key to be used for building the user-scoped cache key.
   * @returns The user-scoped cache key.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  buildUserScopedKey(key: string): string
}
