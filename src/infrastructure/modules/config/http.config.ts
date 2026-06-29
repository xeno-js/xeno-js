import type { IHttpClient, IRemoteDataSource } from '@/domain'
import type { HttpHeaders, InjectionToken, Optional } from '@/shared'

import type { ResilienceConfig } from './resilience.config'

/**
 * @description HttpCoreConfig is an interface that defines the configuration options for the core HTTP functionality of the application. It includes two properties: 'http' of type HttpConfig, which specifies the configuration for the HTTP client, and 'resilience' of type ResilienceConfig, which provides the settings for implementing resilience strategies such as retries, circuit breakers, and timeouts. This interface allows for a centralized configuration of both HTTP and resilience features in the application.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export interface HttpCoreConfig {
  /** @description A unique token used for identifying the RemoteDataSource instance in the dependency injection container.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  dataSourceToken: InjectionToken<IRemoteDataSource>
  /** @description The configuration options for the HTTP client, including default headers, base URL, and timeout settings.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  http: HttpConfig
  /** @description The configuration options for implementing resilience strategies, including retries, circuit breakers, and timeouts. This allows for enhancing the reliability of service interactions by automatically handling transient faults and preventing cascading failures in distributed systems.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  resilience: ResilienceConfig
}

/**
 * @description HttpConfig is an interface that defines the configuration options for an HTTP client. It includes a required 'client' property of type HttpClientConfig, which specifies the default headers, base URL, and timeout for the HTTP client. Additionally, it has an optional 'resilience' property that indicates whether resilience features are enabled and provides the corresponding ResilienceConfig if they are.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export interface HttpConfig {
  /** @description A unique token used for identifying the HTTP client configuration in the dependency injection container.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  token: InjectionToken<IHttpClient>
  /** @description The configuration options for the HTTP client, including default headers, base URL, and timeout settings.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  client: HttpClientConfig
}

/**
 * @description Agnostic contract used to execute HTTP calls independently
 * from concrete transport libraries (fetch, axios, undici, etc.),

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export interface HttpClientConfig {
  /** @description Optional default headers to include in every request made by the HTTP client.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  defaultHeaders: Optional<HttpHeaders>
  /** @description Optional base URL to prepend to all request URLs made by the HTTP client.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  baseURL: Optional<string>
  /** @description Optional timeout in milliseconds for all requests made by the HTTP client.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  timeoutMs: Optional<number>
}
