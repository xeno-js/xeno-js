/* eslint-disable @typescript-eslint/naming-convention */
import type {
  AuthClaims,
  HttpHeaders,
  HttpMethod,
  IBaseAuthService,
  IBaseMapper,
  ICache,
  ICacheKeyBuilder,
  ICommand,
  IConcurrencyService,
  IConfigurationService,
  IContextAccessor,
  Identity,
  IDisposable,
  IExtendendService,
  IFactory,
  IGateKeeper,
  IIdempotencyStore,
  IIdentityAccessor,
  ILogger,
  ILoggerClient,
  IMediator,
  IMiddleware,
  INetworkContextAccessor,
  IPipelineBehavior,
  IPolicyRegistry,
  IQuery,
  IRequest,
  IServiceExtractor,
  IServiceResilience,
  IStrategy,
  ITransactionState,
  IUnitOfWork,
  IValidatorService,
  Metadata,
  Optional,
  RequestContext,
  UserContext,
} from '@xeno-js/shared'

import type {
  IAllowMethod,
  IAllowOrigin,
  IRequestContext,
  IServiceContainer,
  IServiceScope,
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
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface ApplicationRegistry<T = unknown, Ttx = unknown> {
  readonly ALLOW_ORIGIN: IAllowOrigin
  readonly ALLOW_METHOD: IAllowMethod
  /** @description Token used to register and resolve the AuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly AUTHORIZATION_PIPELINE: IPipelineBehavior<IRequest, unknown>

  /** @description Token used to register and resolve the AuthService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly AUTH_SERVICE: IExtendendService

  readonly BASE_AUTH_SERVICE: IBaseAuthService

  /** @description Token used to register and resolve the BearerTokenExtractor instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly BEARER_TOKEN_EXTRACTOR: IServiceExtractor<HttpHeaders, Optional<string>>

  /** @description Token used to register and resolve the InMemoryCache instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly CACHE: ICache

  /** @description Token used to register and resolve the CacheKeyBuilder instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly CACHE_KEY_BUILDER: ICacheKeyBuilder

  /** @description Token used to register and resolve the ClaimsIdentityMapper instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly CLAIMS_IDENTITY_MAPPER: IBaseMapper<AuthClaims, Identity>

  /** @description Token used to register and resolve the CommandPipeline behaviors in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly COMMAND_PIPELINES_BEHAVIOR: IPipelineBehavior<ICommand, unknown>

  /** @description Token used to register and resolve the CompositePipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly COMPOSITE_PIPELINE: IPipelineBehavior<IQuery, unknown>

  /** @description Token used to register and resolve the ConcurrencyRetryPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly CONCURRENCY_RETRY_PIPELINE: IPipelineBehavior<ICommand, unknown>

  /** @description Token used to register and resolve the ConcurrencyService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly CONCURRENCY_SERVICE: IConcurrencyService

  /** @description Token used to register and resolve the ConfigurationService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly CONFIGURATION_SERVICE: IConfigurationService

  /** @description Token used to register and resolve the ConsoleLogger instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly CONSOLE_LOGGER: ILoggerClient

  /** @description Token used to register and resolve the DbContext instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly DB_CONTEXT: T

  /** @description Token used to register and resolve the ExceptionPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly EXCEPTION_PIPELINE: IPipelineBehavior<IRequest, unknown>

  /** @description Token used to register and resolve the GateKeeper instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly GATE_KEEPER: IGateKeeper

  /** @description Token used to register and resolve the IdempotencyPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly IDEMPOTENCY_PIPELINE: IPipelineBehavior<ICommand, unknown>

  /** @description Token used to register and resolve the IdempotencyStore instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly IDEMPOTENCY_STORE: IIdempotencyStore

  /** @description Token used to register and resolve the Logger instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly LOGGER: ILogger

  /** @description Token used to register and resolve the LoggingPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly LOGGING_PIPELINE: IPipelineBehavior<IRequest, unknown>

  /** @description Token used to register and resolve the Mediator instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly MEDIATOR: IMediator

  /** @description Token used to register and resolve the RequestContextMiddleware in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly MIDDLEWARE: IMiddleware<HttpHeaders>
  readonly AUTH_MIDDLEWARE: IMiddleware<HttpHeaders>
  readonly CSRF_MIDDLEWARE: IMiddleware<HttpHeaders>
  readonly ALLOW_ORIGIN_MIDDLEWARE: IMiddleware<HttpHeaders>
  readonly CORS_MIDDLEWARE: IMiddleware<HttpHeaders>
  readonly METHOD_CHECK_MIDDLEWARE: IMiddleware<HttpHeaders>
  readonly OPTIONS_MIDDLEWARE: IMiddleware<HttpHeaders>
  readonly REQUEST_CONTEXT_MIDDLEWARE: IMiddleware<HttpHeaders>
  readonly RATE_LIMITER_MIDDLEWARE: IMiddleware<HttpHeaders>

  /** @description Token used to register and resolve the PerformancePipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly PERFORMANCE_PIPELINE: IPipelineBehavior<IRequest, unknown>

  /** @description Token used to register and resolve the PermissionAuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly PERMISSION_AUTHORIZATION_PIPELINE: IStrategy<IRequest>

  /** @description Token used to register and resolve the PinoLogger instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly PINO_LOGGER: ILoggerClient

  /** @description Token used to register and resolve the PolicyRegistry instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly POLICY_REGISTRY: IPolicyRegistry

  /** @description Token used to register and resolve the QueryCachingPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly QUERY_CACHING_PIPELINE: IPipelineBehavior<IQuery, unknown>

  /** @description Token used to register and resolve the QueryPipeline behaviors in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly QUERY_PIPELINES_BEHAVIOR: IPipelineBehavior<IQuery, unknown>

  /** @description Token used to register and resolve the RoutesRegistry instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly REGISTRY_ROUTES: Record<`/${string}`, Record<HttpMethod, 'isPublic'>>

  /** @description Token used to register and resolve the RequestContext instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly REQUEST_CONTEXT: IRequestContext<RequestContext, ApplicationRegistry<T>>

  /** @description Token used to register and resolve the IServiceResilience instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly RESILIENCE_CLIENT: IServiceResilience

  /** @description Token used to register and resolve the RoleAuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly ROLE_AUTHORIZATION_PIPELINE: IStrategy<IRequest>

  /** @description Token used to register and resolve the SchemaValidationStrategy instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly SCHEMA_VALIDATION_STRATEGY: IStrategy<IRequest, boolean>

  /** @description Token used to register and resolve the SentryLogger instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly SENTRY_LOGGER: ILoggerClient

  /** @description Token used to register and resolve the ServiceContainer instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly SERVICE_CONTAINER: IServiceContainer

  /** @description Token used to register and resolve the ServiceExtractor instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly SERVICE_EXTRACTOR: IServiceExtractor<HttpHeaders, Metadata>

  /** @description Token used to register and resolve the ServiceScopeFactory instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly SERVICE_SCOPE_FACTORY: IFactory<void, IServiceScope>

  /** @description Token used to register and resolve the TenantAuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly TENANT_AUTHORIZATION_PIPELINE: IStrategy<IRequest>

  /** @description Token used to register and resolve the TransactionState instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly TRANSACTION_STATE: ITransactionState<Ttx>

  /** @description Token used to register and resolve the UnitOfWork instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly UNIT_OF_WORK: IUnitOfWork & IDisposable

  /** @description Token used to register and resolve the UserAuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly USER_AUTHORIZATION_PIPELINE: IStrategy<IRequest>

  /** @description Token used to register and resolve the ValidationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly VALIDATION_PIPELINE: IPipelineBehavior<IRequest, unknown>

  /** @description Token used to register and resolve the ZodValidator instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly ZOD_VALIDATOR: IValidatorService

  // --- COMPONENTI ACCESSOR STRUTTURATI ED ESTRATTORI (NUOVI) ---

  /** @description Token used to register and resolve the IIdentityAccessor in the dependency injection container, allowing access only to current user identity information.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly IDENTITY_ACCESSOR: IIdentityAccessor

  /** @description Token used to register and resolve the IServiceScopeAccessor in the dependency injection container, granting controlled access to the current request scope.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly SERVICE_SCOPE_ACCESSOR: IServiceScopeAccessor<ApplicationRegistry<T>>

  /** @description Token used to register and resolve the IContextAccessor instance in the dependency injection container to fetch execution context properties.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly CONTEXT_ACCESSOR: IContextAccessor<RequestContext>

  /** @description Token used to register and resolve the INetworkContextAccessor instance in the dependency injection container to fetch networking/observability context data.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly NETWORK_CONTEXT_ACCESSOR: INetworkContextAccessor

  /** @description Token used to register and resolve the UserContext factory in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly USER_CONTEXT_FACTORY: IFactory<void, UserContext>
}
