/**
 * @description This file defines the tokens used for dependency injection in the application.
 * Tokens are unique identifiers that are used to register and resolve dependencies in the container.
 * They can be symbols, strings, or classes, but using symbols is a common practice to avoid naming collisions.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const TOKENS = Object.freeze({
  /** @description Token used to register and resolve the AuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  AUTHORIZATION_PIPELINE: 'AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the AuthService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  AUTH_SERVICE: 'AUTH_SERVICE',
  /** @description Token used to register and resolve the BearerTokenExtractor instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  BEARER_TOKEN_EXTRACTOR: 'BEARER_TOKEN_EXTRACTOR',
  /** @description Token used to register and resolve the InMemoryCache instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CACHE: 'CACHE',
  /** @description Token used to register and resolve the CacheKeyBuilder instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CACHE_KEY_BUILDER: 'CACHE_KEY_BUILDER',
  /** @description Token used to register and resolve the ClaimsIdentityMapper instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CLAIMS_IDENTITY_MAPPER: 'CLAIMS_IDENTITY_MAPPER',
  /** @description Token used to register and resolve command pipeline behaviors in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  COMMAND_PIPELINES_BEHAVIOR: 'COMMAND_PIPELINES_BEHAVIOR',
  /** @description Token used to register and resolve the CompositePipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  COMPOSITE_PIPELINE: 'COMPOSITE_PIPELINE',
  /** @description Token used to register and resolve the ConcurrencyRetryPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CONCURRENCY_RETRY_PIPELINE: 'CONCURRENCY_RETRY_PIPELINE',
  /** @description Token used to register and resolve the ConcurrencyService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CONCURRENCY_SERVICE: 'CONCURRENCY_SERVICE',
  /** @description Token used to register and resolve the ConfigurationService instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CONFIGURATION_SERVICE: 'CONFIGURATION_SERVICE',
  /** @description Token used to register and resolve the ConsoleLogger instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CONSOLE_LOGGER: 'CONSOLE_LOGGER',
  /** @description Token used to register and resolve the ContextAccessor instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CONTEXT_ACCESSOR: 'CONTEXT_ACCESSOR',
  /** @description Token used to register and resolve the DbContext instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  DB_CONTEXT: 'DB_CONTEXT',
  /** @description Token used to register and resolve the ExceptionPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  EXCEPTION_PIPELINE: 'EXCEPTION_PIPELINE',
  /** @description Token used to register and resolve the GateKeeper instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  GATE_KEEPER: 'GATE_KEEPER',
  /** @description Token used to register and resolve the IdempotencyPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  IDEMPOTENCY_PIPELINE: 'IDEMPOTENCY_PIPELINE',
  /** @description Token used to register and resolve the IdempotencyStore instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  IDEMPOTENCY_STORE: 'IDEMPOTENCY_STORE',
  /** @description Token used to register and resolve the IdentityAccessor instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  IDENTITY_ACCESSOR: 'IDENTITY_ACCESSOR',
  /** @description Token used to register and resolve the Logger instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  LOGGER: 'LOGGER',
  /** @description Token used to register and resolve the LoggerConfig instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  LOGGER_CONFIG: 'LOGGER_CONFIG',
  /** @description Token used to register and resolve the LoggingPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  LOGGING_PIPELINE: 'LOGGING_PIPELINE',
  /** @description Token used to register and resolve the Mediator instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  MEDIATOR: 'MEDIATOR',
  /** @description Token used to register and resolve the PerformancePipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  PERFORMANCE_PIPELINE: 'PERFORMANCE_PIPELINE',
  /** @description Token used to register and resolve the PermissionAuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  PERMISSION_AUTHORIZATION_PIPELINE: 'PERMISSION_AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the PinoLogger instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  PINO_LOGGER: 'PINO_LOGGER',
  /** @description Token used to register and resolve the PolicyRegistry instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  POLICY_REGISTRY: 'POLICY_REGISTRY',
  /** @description Token used to register and resolve the QueryCachingPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  QUERY_CACHING_PIPELINE: 'QUERY_CACHING_PIPELINE',
  /** @description Token used to register and resolve query pipeline behaviors in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  QUERY_PIPELINES_BEHAVIOR: 'QUERY_PIPELINES_BEHAVIOR',
  /** @description Token used to register and resolve the RequestContext instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  REQUEST_CONTEXT: 'REQUEST_CONTEXT',
  /** @description Token used to register and resolve the RequestContextMiddleware in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  MIDDLEWARE: 'MIDDLEWARE',
  /** @description Token used to register and resolve the IServiceResilience instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  RESILIENCE_CLIENT: 'RESILIENCE_CLIENT',
  /** @description Token used to register and resolve the RoleAuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  ROLE_AUTHORIZATION_PIPELINE: 'ROLE_AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the SchemaValidationStrategy instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  SCHEMA_VALIDATION_STRATEGY: 'SCHEMA_VALIDATION_STRATEGY',
  /** @description Token used to register and resolve the SentryLogger instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  SENTRY_LOGGER: 'SENTRY_LOGGER',
  /** @description Token used to register and resolve the ServiceContainer instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  SERVICE_CONTAINER: 'SERVICE_CONTAINER',
  /** @description Token used to register and resolve the ServiceExtractor instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  SERVICE_EXTRACTOR: 'SERVICE_EXTRACTOR',
  /** @description Token used to register and resolve the ServiceScopeFactory instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  SERVICE_SCOPE_FACTORY: 'SERVICE_SCOPE_FACTORY',
  /** @description Token used to register and resolve the TenantAuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  TENANT_AUTHORIZATION_PIPELINE: 'TENANT_AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the UnitOfWork instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  UNIT_OF_WORK: 'UNIT_OF_WORK',
  /** @description Token used to register and resolve the UserAuthorizationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  USER_AUTHORIZATION_PIPELINE: 'USER_AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the ValidationPipeline instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  VALIDATION_PIPELINE: 'VALIDATION_PIPELINE',
  /** @description Token used to register and resolve the ZodValidator instance in the dependency injection container.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  ZOD_VALIDATOR: 'ZOD_VALIDATOR',
  SERVICE_SCOPE_ACCESSOR: 'SERVICE_SCOPE_ACCESSOR',
  NETWORK_CONTEXT_ACCESSOR: 'NETWORK_CONTEXT_ACCESSOR',
  USER_CONTEXT_FACTORY: 'USER_CONTEXT_FACTORY',
  TRANSACTION_STATE: 'TRANSACTION_STATE',
  ROUTE_MATCHER: 'ROUTE_MATCHER',
} as const)
