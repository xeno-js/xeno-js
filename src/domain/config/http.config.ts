import type { HttpClientConfig, SetupAction } from '@xeno-js/shared'

import type { IServiceContainer } from '../contracts'
import type { ApplicationRegistry } from '../registries'
import type { ResilienceConfig } from './resilience.config'

/**
 * @description HttpCoreConfig is an interface that defines the configuration options for the core HTTP functionality of the application. It includes two properties: 'http' of type HttpConfig, which specifies the configuration for the HTTP client, and 'resilience' of type ResilienceConfig, which provides the settings for implementing resilience strategies such as retries, circuit breakers, and timeouts. This interface allows for a centralized configuration of both HTTP and resilience features in the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface HttpCoreConfig<
  TRegistry extends ApplicationRegistry<unknown> = ApplicationRegistry<unknown>,
> {
  /** @description A unique token used for identifying the RemoteDataSource instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  dataSourceToken: SetupAction<IServiceContainer<TRegistry>>
  /** @description The configuration options for the HTTP client, including default headers, base URL, and timeout settings.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  http: HttpConfig<TRegistry>
  /** @description The configuration options for implementing resilience strategies, including retries, circuit breakers, and timeouts. This allows for enhancing the reliability of service interactions by automatically handling transient faults and preventing cascading failures in distributed systems.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  resilience: ResilienceConfig
}

/**
 * @description HttpConfig is an interface that defines the configuration options for an HTTP client. It includes a required 'client' property of type HttpClientConfig, which specifies the default headers, base URL, and timeout for the HTTP client. Additionally, it has an optional 'resilience' property that indicates whether resilience features are enabled and provides the corresponding ResilienceConfig if they are.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface HttpConfig<
  TRegistry extends ApplicationRegistry<unknown> = ApplicationRegistry<unknown>,
> {
  /** @description A unique token used for identifying the HTTP client configuration in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  token: keyof TRegistry
  /** @description The configuration options for the HTTP client, including default headers, base URL, and timeout settings.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  client: HttpClientConfig
}
