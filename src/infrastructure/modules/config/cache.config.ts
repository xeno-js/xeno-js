import type { Optional } from '@/shared'

/** @description Configuration for Redis integration, including details such as host, port, and credentials. If enabled, the query bus and command bus (in case of idempotency) pipelines will use Redis as the cache system to store and retrieve data efficiently. The configuration includes specific details for Redis integration, such as host, port, and credentials, providing flexibility in how the cache is implemented and used within the application. */
export interface CacheConfig {
  /** @description Flag to enable or disable Redis integration for caching. If set to true, the application will use Redis as the cache system for the query bus and command bus (in case of idempotency) pipelines, allowing for efficient storage and retrieval of data. If set to false or not defined, Redis integration will be skipped, and the application may use an alternative caching mechanism (e.g., in-memory cache) based on other configurations. */
  isEnabled: boolean
  redis: {
    /** @description Flag to enable or disable Redis caching. If set to true, the application will use Redis as the cache system for the query bus and command bus (in case of idempotency) pipelines, allowing for efficient storage and retrieval of data. If set to false or not defined, Redis caching will be skipped, and the application may use an alternative caching mechanism (e.g., in-memory cache) based on other configurations. */
    isEnabled: boolean
    /** @description Optional configuration for the Redis cache client, including details such as host, port, and credentials. If provided, this configuration will be used to establish a connection to the Redis server for caching purposes. If not defined, default connection settings will be used. */
    config: Optional<CacheClientConfig>
  }
}

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
