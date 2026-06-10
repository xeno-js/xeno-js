import type { Optional } from '@/shared'

/**
 * @description An interface representing a cache client, which provides methods for getting and setting values in a cache storage. This interface abstracts the underlying cache implementation, allowing for flexibility in choosing different caching solutions (e.g., in-memory, Redis) without affecting the rest of the application.
 */
export interface CacheClientConfig {
  /**
   * @description The host address of the cache server (e.g., Redis). Optional for in-memory cache implementations.
   */
  host: Optional<string>
  /**
   * @description The port number of the cache server (e.g., Redis). Optional for in-memory cache implementations. */
  port: Optional<number>
  /**
   * @description The password for authenticating with the cache server (e.g., Redis). Optional for in-memory cache implementations.
   */
  password: Optional<string>
}

/**
 * @description An interface representing cacheable options, which includes properties for cache key, TTL, and bypass flags. This allows query handlers to determine how to cache the results of the query based on the provided options.
 */
export interface ICacheableOptions {
  /**
   * @description A unique key under which to save the result. Must include parameters (e.g., `travel-intents:tenant-123:page-1`).
   */
  readonly cacheKey: string

  /**
   * @description Time to live for the cache entry in seconds. Optional; if omitted, a default TTL defined in the caching layer will be used. Must be a positive integer if provided.
   */
  readonly cacheTtlSeconds: Optional<number>

  /**
   * @description If true, indicates that the cache should be bypassed for this request. Similar to consistentRead but less semantically explicit.
   * If both bypassCache and consistentRead are provided, consistentRead takes precedence.
   */
  readonly bypassCache: Optional<boolean>

  /**
   * @description (Optional) If true, indicates that a consistent read is required, bypassing the cache. Similar to bypassCache but more semantically explicit.
   */
  readonly consistentRead: Optional<boolean>
}
