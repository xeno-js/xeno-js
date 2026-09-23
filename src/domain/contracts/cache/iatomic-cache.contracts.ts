import type { ICache, Optional } from '@xeno-js/shared'

/**
 * @description IAtomicCache is an interface that extends the ICache interface and adds an increment method. The increment method takes a key and an optional ttlSeconds parameter and returns a Promise that resolves to an incremented value.
 *
 */
export interface IAtomicCache extends ICache {
  /**
   * @description The increment method increments the value associated with the given key in the cache. If the key does not exist, it is created with an initial value of 1. The method returns a Promise that resolves to the incremented value.
   *
   * @param key The key to increment the value for.
   * @param ttlSeconds The time-to-live (TTL) in seconds for the key-value pair. If not provided, the default TTL is used.
   * @returns A Promise that resolves to the incremented value.
   */
  increment(key: string, ttlSeconds: Optional<number | string>): Promise<number>
}
