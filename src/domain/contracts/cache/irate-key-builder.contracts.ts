import type { Optional } from '@xeno-js/shared'

/**
 * @description An interface that defines the contract for a rate limit key builder in a Xeno Vue application. This interface requires the implementation of a single method, buildRateLimitKey, which takes a resource and a client IP address as parameters and returns a string representing the rate limit key.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-vue
 * @copyright Xeno
 * @license MIT
 */
export interface IRateLimitKeyBuilder {
  /**
   * Builds a rate limit key based on the provided resource and client IP address
   * @param resource the resource to limit
   * @param clientIp the client IP address
   */
  buildRateLimitKey(resource: string): Optional<string>
}
