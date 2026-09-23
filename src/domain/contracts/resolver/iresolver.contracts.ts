import type { Optional } from '@xeno-js/shared'

/**
 * @description IIPResolver is a generic interface that defines a contract for resolving IP addresses.
 */
export interface IIPResolver {
  /**
   * @description Resolves a optional string based on the input of type T.
   * @param request The input of type T.
   * @param ip The optional IP address of the client.
   * @returns The resolved optional string.
   */
  resolve<T>(request: T, ip: Optional<string>): Optional<string>
}
