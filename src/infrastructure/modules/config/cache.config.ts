import type { Optional } from '@/shared'

/** @description Configuration for Redis integration, including details such as host, port, and credentials. If enabled, the query bus and command bus (in case of idempotency) pipelines will use Redis as the cache system to store and retrieve data efficiently. The configuration includes specific details for Redis integration, such as host, port, and credentials, providing flexibility in how the cache is implemented and used within the application.
 *
 * @author Mattia Carcione
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/gear5
 */
export interface CacheConfig {
  redis: {
    /** @description Optional configuration for the Redis cache client, including details such as host, port, and credentials. If provided, this configuration will be used to establish a connection to the Redis server for caching purposes. If not defined, default connection settings will be used.
     *
     * @author Mattia Carcione
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/gear5
     */
    config: Optional<CacheClientConfig>
  }
}

/**
 * @description An interface representing a cache client, which provides methods for getting and setting values in a cache storage. This interface abstracts the underlying cache implementation, allowing for flexibility in choosing different caching solutions (e.g., in-memory, Redis) without affecting the rest of the application.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface CacheClientConfig {
  /**
   * @description The host address of the cache server (e.g., Redis). Optional for in-memory cache implementations.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  host: Optional<string>
  /**
   * @description The port number of the cache server (e.g., Redis). Optional for in-memory cache implementations.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  port: Optional<number>
  /**
   * @description The password for authenticating with the cache server (e.g., Redis). Optional for in-memory cache implementations.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  password: Optional<string>
}
