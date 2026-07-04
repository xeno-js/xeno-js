import type { Optional } from '@/shared'

/** @description Configuration for Redis integration, including details such as host, port, and credentials. If enabled, the query bus and command bus (in case of idempotency) pipelines will use Redis as the cache system to store and retrieve data efficiently. The configuration includes specific details for Redis integration, such as host, port, and credentials, providing flexibility in how the cache is implemented and used within the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface CacheConfig {
  /** @description Optional configuration for in-memory cache integration. If enabled, the query bus and command bus (in case of idempotency) pipelines will use an in-memory cache system to store and retrieve data efficiently. The configuration includes specific details for in-memory cache integration, providing flexibility in how the cache is implemented and used within the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  inMemory: boolean
  /** @description Optional configuration for Redis integration, including details such as host, port, and credentials. If provided and enabled, the application will use Redis as the cache system to store and retrieve data efficiently. The configuration includes specific details for Redis integration, such as host, port, and credentials, providing flexibility in how the cache is implemented and used within the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  redis: Optional<CacheClientConfig>
}

/**
 * @description An interface representing a cache client, which provides methods for getting and setting values in a cache storage. This interface abstracts the underlying cache implementation, allowing for flexibility in choosing different caching solutions (e.g., in-memory, Redis) without affecting the rest of the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface CacheClientConfig {
  /**
   * @description The host address of the cache server (e.g., Redis). Optional for in-memory cache implementations.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  host: Optional<string>
  /**
   * @description The port number of the cache server (e.g., Redis). Optional for in-memory cache implementations.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  port: Optional<number>
  /**
   * @description The password for authenticating with the cache server (e.g., Redis). Optional for in-memory cache implementations.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  password: Optional<string>
  /** @description The username for authenticating with the cache server (e.g., Redis). Optional for in-memory cache implementations.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  username: Optional<string>
  /** @description A boolean flag indicating whether to use TLS/SSL for the connection to the cache server (e.g., Redis). Optional for in-memory cache implementations.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  tls: boolean
  /** @description The maximum number of reconnection attempts before declaring failure. Optional for in-memory cache implementations.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  maxRetriesPerRequest: Optional<number>
}
