import type { Optional } from './common.types'

/**
 * @description An interface representing cacheable options, which includes properties for cache key, TTL, and bypass flags. This allows query handlers to determine how to cache the results of the query based on the provided options.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface ICacheableOptions {
  /**
   * @description A unique key under which to save the result. Must include parameters (e.g., `travel-intents:tenant-123:page-1`).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly cacheKey: string

  /**
   * @description Time to live for the cache entry in seconds. Optional; if omitted, a default TTL defined in the caching layer will be used. Must be a positive integer if provided.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly ttl: Optional<number>

  /**
   * @description If true, indicates that the cache should be bypassed for this request. Similar to consistentRead but less semantically explicit.
   * If both bypassCache and consistentRead are provided, consistentRead takes precedence.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly bypassCache: Optional<boolean>

  /**
   * @description (Optional) If true, indicates that a consistent read is required, bypassing the cache. Similar to bypassCache but more semantically explicit.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly consistentRead: Optional<boolean>

  /**
   * @description (Optional) If true, indicates that the cache entry is scoped to the current user. This is useful for multi-tenant applications where cached data should be isolated per user or tenant.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly isUserScoped: boolean
}
