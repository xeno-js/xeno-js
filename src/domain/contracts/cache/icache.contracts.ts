import type { Optional } from '@/shared'

/**
 * @fileoverview Defines the ICache interface for caching mechanisms within the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */

/**
 * An interface representing a caching mechanism within the application. This interface provides methods for retrieving and storing values in the cache, as well as clearing the cache when necessary. The get method allows for retrieving values from the cache based on a specified key, while the set method enables storing values in the cache with an optional time-to-live (TTL) parameter to specify how long the value should remain in the cache before it expires. The clear method provides a way to remove all entries from the cache when needed.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface ICache {
  /**
   * Retrieves a value from the cache based on the specified key. If the key exists in the cache and has not expired, the corresponding value will be returned. If the key does not exist or has expired, this method will return undefined, indicating that there is no valid cached value available for the given key.
   * @param key The unique identifier for the cached value. This key is used to store and retrieve values from the cache.
   * @returns The value associated with the specified key if it exists and has not expired; otherwise, returns undefined.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  get<T>(key: string): Promise<Optional<T>>

  /**
   * Stores a value in the cache with the specified key and an optional time-to-live (TTL) parameter. The TTL parameter specifies how long the value should remain in the cache before it expires. If the TTL is not provided, the value will be stored indefinitely until it is explicitly removed or cleared from the cache. This method allows for efficient caching of values that may have a limited lifespan, ensuring that stale data is not returned when retrieving values from the cache.
   * @param key The unique identifier for the cached value. This key is used to store and retrieve values from the cache.
   * @param value The value to be stored in the cache associated with the specified key.
   * @param ttl Optional time-to-live (TTL) in milliseconds, indicating how long the value should remain in the cache before it expires. If not provided, the value will be stored indefinitely.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  set<T>(key: string, value: T, ttl: Optional<number>): Promise<void>

  /**
   * Stores a value in the cache only if the specified key does not already exist. This method is useful for ensuring that a value is only set in the cache if it has not been previously stored, preventing overwriting of existing values. The TTL parameter specifies how long the value should remain in the cache before it expires, similar to the set method. If the key already exists in the cache, this method will return false, indicating that the value was not set; otherwise, it will store the value and return true.
   * @param key The unique identifier for the cached value. This key is used to store and retrieve values from the cache.
   * @param value The value to be stored in the cache associated with the specified key.
   * @param ttl Optional time-to-live (TTL) in milliseconds, indicating how long the value should remain in the cache before it expires. If not provided, the value will be stored indefinitely.
   * @returns True if the value was successfully stored in the cache because the key did not already exist; otherwise, returns false if the key already exists in the cache and the value was not set.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  setIfAbsent<T>(key: string, value: T, ttl: Optional<number>): Promise<boolean>

  /**
   * Removes a specific entry from the cache based on the provided key. This method allows for targeted invalidation of cached values when they are no longer valid or needed. After calling this method with a specific key, subsequent calls to the get method with that key will return undefined until a new value is stored in the cache using the set method.
   * @param key The unique identifier for the cached value to be removed. This key is used to identify which entry in the cache should be invalidated.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  remove(key: string): Promise<void>

  /**
   * Checks if a specific key exists in the cache and has not expired. This method returns true if the key is present in the cache and its associated value is still valid; otherwise, it returns false. This can be useful for determining whether a cached value can be retrieved without actually fetching it, allowing for more efficient cache management and decision-making based on the presence of valid cached data.
   * @param key The unique identifier for the cached value to check for existence. This key is used to determine if a valid entry exists in the cache.
   * @returns True if the key exists in the cache and has not expired; otherwise, returns false.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  has(key: string): Promise<boolean>

  /**
   * Clears all entries from the cache, effectively removing all stored values. This method can be used when there is a need to invalidate the entire cache, such as when significant changes occur in the underlying data or when the cache needs to be reset for any reason. After calling this method, subsequent calls to the get method will return undefined until new values are stored in the cache using the set method.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  clear(): Promise<void>
}
