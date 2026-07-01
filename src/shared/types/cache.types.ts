import type { Optional } from './common.types'

/**
 * @description An interface representing cacheable options, which includes properties for cache key, TTL, and bypass flags. This allows query handlers to determine how to cache the results of the query based on the provided options.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface ICacheableOptions {
  /**
   * @description A unique key under which to save the result. Must include parameters (e.g., `travel-intents:tenant-123:page-1`).
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly cacheKey: string

  /**
   * @description Time to live for the cache entry in seconds. Optional; if omitted, a default TTL defined in the caching layer will be used. Must be a positive integer if provided.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly cacheTtlSeconds: Optional<number>

  /**
   * @description If true, indicates that the cache should be bypassed for this request. Similar to consistentRead but less semantically explicit.
   * If both bypassCache and consistentRead are provided, consistentRead takes precedence.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly bypassCache: Optional<boolean>

  /**
   * @description (Optional) If true, indicates that a consistent read is required, bypassing the cache. Similar to bypassCache but more semantically explicit.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly consistentRead: Optional<boolean>
}
