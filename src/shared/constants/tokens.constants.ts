/**
 * @description This file defines the tokens used for dependency injection in the application.
 * Tokens are unique identifiers that are used to register and resolve dependencies in the container.
 * They can be symbols, strings, or classes, but using symbols is a common practice to avoid naming collisions.
 */
export const TOKENS = Object.freeze({
  /** @description Token used to register and resolve the AuthService instance in the dependency injection container. */
  AUTH_SERVICE: 'AUTH_SERVICE',
  /** @description Token used to register and resolve the InMemoryCache instance in the dependency injection container. */
  CACHE: 'CACHE',
  /** @description Token used to register and resolve the RequestContextMiddleware in the dependency injection container. */
  REQUEST_CONTEXT_MIDDLEWARE: 'REQUEST_CONTEXT_MIDDLEWARE',
  /** @description Token used to register and resolve command pipeline behaviors in the dependency injection container. */
  COMMAND_PIPELINES_BEHAVIOR: 'COMMAND_PIPELINES_BEHAVIOR',
  /** @description Token used to register and resolve query pipeline behaviors in the dependency injection container. */
  QUERY_PIPELINES_BEHAVIOR: 'QUERY_PIPELINES_BEHAVIOR',
  /** @description Token used to register and resolve the Mediator instance in the dependency injection container. */
  MEDIATOR: 'MEDIATOR',
  /** @description Token used to register and resolve the RequestContext instance in the dependency injection container. */
  REQUEST_CONTEXT: 'REQUEST_CONTEXT',
  /** @description Token used to register and resolve the ServiceExtractor instance in the dependency injection container. */
  SERVICE_EXTRACTOR: 'SERVICE_EXTRACTOR',
  /** @description Token used to register and resolve the GateKeeper instance in the dependency injection container. */
  GATE_KEEPER: 'GATE_KEEPER',
  /** @description Token used to register and resolve the ServiceContainer instance in the dependency injection container. */
  SERVICE_CONTAINER: 'SERVICE_CONTAINER',
  /** @description Token used to register and resolve the LoggerConfig instance in the dependency injection container. */
  LOGGER_CONFIG: 'LOGGER_CONFIG',
  /** @description Token used to register and resolve the Logger instance in the dependency injection container. */
  LOGGER: 'LOGGER',
  /** @description Token used to register and resolve the ConsoleLogger instance in the dependency injection container. */
  CONSOLE_LOGGER: 'CONSOLE_LOGGER',
  /** @description Token used to register and resolve the SentryLogger instance in the dependency injection container. */
  SENTRY_LOGGER: 'SENTRY_LOGGER',
  /** @description Token used to register and resolve the PinoLogger instance in the dependency injection container. */
  PINO_LOGGER: 'PINO_LOGGER',
  /** @description Token used to register and resolve the BearerTokenExtractor instance in the dependency injection container. */
  BEARER_TOKEN_EXTRACTOR: 'BEARER_TOKEN_EXTRACTOR',
  /** @description Token used to register and resolve the ExceptionPipeline instance in the dependency injection container. */
  EXCEPTION_PIPELINE: 'EXCEPTION_PIPELINE',
  /** @description Token used to register and resolve the AuthorizationPipeline instance in the dependency injection container. */
  AUTHORIZATION_PIPELINE: 'AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the CompositePipeline instance in the dependency injection container. */
  COMPOSITE_PIPELINE: 'COMPOSITE_PIPELINE',
  /** @description Token used to register and resolve the ConcurrencyRetryPipeline instance in the dependency injection container. */
  CONCURRENCY_RETRY_PIPELINE: 'CONCURRENCY_RETRY_PIPELINE',
  /** @description Token used to register and resolve the IdempotencyPipeline instance in the dependency injection container. */
  IDEMPOTENCY_PIPELINE: 'IDEMPOTENCY_PIPELINE',
  /** @description Token used to register and resolve the LoggingPipeline instance in the dependency injection container. */
  LOGGING_PIPELINE: 'LOGGING_PIPELINE',
  /** @description Token used to register and resolve the PerformancePipeline instance in the dependency injection container. */
  PERFORMANCE_PIPELINE: 'PERFORMANCE_PIPELINE',
  /** @description Token used to register and resolve the SchemaValidationStrategy instance in the dependency injection container. */
  SCHEMA_VALIDATION_STRATEGY: 'SCHEMA_VALIDATION_STRATEGY',
  /** @description Token used to register and resolve the ZodValidator instance in the dependency injection container. */
  ZOD_VALIDATOR: 'ZOD_VALIDATOR',
  /** @description Token used to register and resolve the QueryCachingPipeline instance in the dependency injection container. */
  QUERY_CACHING_PIPELINE: 'QUERY_CACHING_PIPELINE',
  /** @description Token used to register and resolve the ValidationPipeline instance in the dependency injection container. */
  VALIDATION_PIPELINE: 'VALIDATION_PIPELINE',
  /** @description Token used to register and resolve the TenantAuthorizationPipeline instance in the dependency injection container. */
  TENANT_AUTHORIZATION_PIPELINE: 'TENANT_AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the RoleAuthorizationPipeline instance in the dependency injection container. */
  ROLE_AUTHORIZATION_PIPELINE: 'ROLE_AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the PermissionAuthorizationPipeline instance in the dependency injection container. */
  PERMISSION_AUTHORIZATION_PIPELINE: 'PERMISSION_AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the PolicyRegistry instance in the dependency injection container. */
  POLICY_REGISTRY: 'POLICY_REGISTRY',
  /** @description Token used to register and resolve the UserAuthorizationPipeline instance in the dependency injection container. */
  USER_AUTHORIZATION_PIPELINE: 'USER_AUTHORIZATION_PIPELINE',
  /** @description Token used to register and resolve the IdempotencyStore instance in the dependency injection container. */
  IDEMPOTENCY_STORE: 'IDEMPOTENCY_STORE',
  /** @description Token used to register and resolve the ClaimsIdentityMapper instance in the dependency injection container. */
  CLAIMS_IDENTITY_MAPPER: 'CLAIMS_IDENTITY_MAPPER',
} as const)
