/* eslint-disable @typescript-eslint/naming-convention */
import type {
  HttpHeaders,
  IBaseAuthService,
  ICacheKeyBuilder,
  ICommand,
  IConcurrencyService,
  IConfigurationService,
  IContextAccessor,
  IDisposable,
  IExtendendAuthService,
  IFactory,
  IIdentityAccessor,
  ILogger,
  IMediator,
  IMiddleware,
  INetworkContextAccessor,
  IPipelineBehavior,
  IQuery,
  IServiceExtractor,
  IServiceResilience,
  IUnitOfWork,
  IValidatorService,
  Metadata,
  RequestContext,
  UserContext,
} from '@xeno-js/shared'

import type {
  IAtomicCache,
  ICryptoService,
  ICsrfTokenService,
  IRequestContext,
  IServiceContainer,
  IServiceScopeAccessor,
} from '@/domain'

/**
 * @description This file defines the injection tokens used for dependency injection in the application.
 * Injection tokens are unique identifiers that are used to register and resolve dependencies in the container.
 * They can be symbols, strings, or classes, but using symbols is a common practice to avoid naming collisions.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface ApplicationRegistry<T = unknown> {
  /** @description Token used to register and resolve the Extended AuthService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly AUTH_SERVICE: IExtendendAuthService
  /** @description Token used to register and resolve the BaseAuthService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly BASE_AUTH_SERVICE: IBaseAuthService
  /** @description Token used to register and resolve the InMemoryCache instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly CACHE: IAtomicCache
  /** @description Token used to register and resolve the CacheKeyBuilder instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly CACHE_KEY_BUILDER: ICacheKeyBuilder
  /** @description Token used to register and resolve the CommandPipeline behaviors in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly COMMAND_PIPELINES_BEHAVIOR: IPipelineBehavior<ICommand, unknown>
  /** @description Token used to register and resolve the ConcurrencyService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly CONCURRENCY_SERVICE: IConcurrencyService
  /** @description Token used to register and resolve the ConfigurationService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly CONFIGURATION_SERVICE: IConfigurationService
  /** @description Token used to register and resolve the CsrfTokenService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly CSRF_TOKEN_SERVICE: ICsrfTokenService
  /** @description Token used to register and resolve the CryptoService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly CRYPTO_SERVICE: ICryptoService
  /** @description Token used to register and resolve the DbContext instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly DB_CONTEXT: T
  /** @description Token used to register and resolve the Logger instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly LOGGER: ILogger
  /** @description Token used to register and resolve the Mediator instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly MEDIATOR: IMediator
  /** @description Token used to register and resolve the RequestContextMiddleware in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly MIDDLEWARE: IMiddleware<HttpHeaders>
  /** @description Token used to register and resolve the QueryPipeline behaviors in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly QUERY_PIPELINES_BEHAVIOR: IPipelineBehavior<IQuery, unknown>
  /** @description Token used to register and resolve the RequestContext instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly REQUEST_CONTEXT: IRequestContext<RequestContext, ApplicationRegistry<T>>
  /** @description Token used to register and resolve the IServiceResilience instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly RESILIENCE_CLIENT: IServiceResilience
  /** @description Token used to register and resolve the ServiceContainer instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly SERVICE_CONTAINER: IServiceContainer
  /** @description Token used to register and resolve the ServiceExtractor instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly SERVICE_EXTRACTOR: IServiceExtractor<HttpHeaders, Metadata>
  /** @description Token used to register and resolve the UnitOfWork instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly UNIT_OF_WORK: IUnitOfWork & IDisposable
  /** @description Token used to register and resolve the ZodValidator instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly VALIDATOR_SERVICE: IValidatorService
  /** @description Token used to register and resolve the IIdentityAccessor in the dependency injection container, allowing access only to current user identity information.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly IDENTITY_ACCESSOR: IIdentityAccessor

  /** @description Token used to register and resolve the IServiceScopeAccessor in the dependency injection container, granting controlled access to the current request scope.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly SERVICE_SCOPE_ACCESSOR: IServiceScopeAccessor<ApplicationRegistry<T>>

  /** @description Token used to register and resolve the IContextAccessor instance in the dependency injection container to fetch execution context properties.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly CONTEXT_ACCESSOR: IContextAccessor<RequestContext>

  /** @description Token used to register and resolve the INetworkContextAccessor instance in the dependency injection container to fetch networking/observability context data.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly NETWORK_CONTEXT_ACCESSOR: INetworkContextAccessor

  /** @description Token used to register and resolve the UserContext factory in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  readonly USER_CONTEXT_FACTORY: IFactory<void, UserContext>
}
