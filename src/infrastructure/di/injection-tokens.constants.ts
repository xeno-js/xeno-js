import type { BaseAuthorizationStrategy, BaseValidationStrategy } from '@/application'
import type {
  ExecutionContext,
  IAuthService,
  IBaseMapper,
  ICache,
  IConcurrencyService,
  IDbClient,
  Identity,
  IFactory,
  IGateKeeper,
  IIdempotencyStore,
  ILogger,
  ILoggerClient,
  IMediator,
  IMiddleware,
  IPipelineBehavior,
  IPolicyRegistry,
  IRequest,
  IRequestContext,
  IServiceContainer,
  IServiceExtractor,
  IServiceResilience,
  IServiceScope,
  IValidatorService,
} from '@/domain'
import type { AuthClaims, HttpHeaders, Metadata, Optional } from '@/shared'
import { TokenHelper, TOKENS } from '@/shared'

import type { LoggerConfig } from '../modules/config'

/**
 * @description This file defines the injection tokens used for dependency injection in the application.
 * Injection tokens are unique identifiers that are used to register and resolve dependencies in the container.
 * They can be symbols, strings, or classes, but using symbols is a common practice to avoid naming collisions.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export const INJECTION_TOKENS = Object.freeze({
  /** @description Token used to register and resolve the AuthorizationPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  AUTHORIZATION_PIPELINE: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.AUTHORIZATION_PIPELINE,
  ),
  /** @description Token used to register and resolve the AuthService instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  AUTH_SERVICE: TokenHelper.createToken<IAuthService>(TOKENS.AUTH_SERVICE),
  /** @description Token used to register and resolve the BearerTokenExtractor instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  BEARER_TOKEN_EXTRACTOR: TokenHelper.createToken<IServiceExtractor<HttpHeaders, Optional<string>>>(
    TOKENS.BEARER_TOKEN_EXTRACTOR,
  ),
  /** @description Token used to register and resolve the InMemoryCache instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  CACHE: TokenHelper.createToken<ICache>(TOKENS.CACHE),
  /** @description Token used to register and resolve the ClaimsIdentityMapper instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  CLAIMS_IDENTITY_MAPPER: TokenHelper.createToken<IBaseMapper<AuthClaims, Identity>>(
    TOKENS.CLAIMS_IDENTITY_MAPPER,
  ),
  /** @description Token used to register and resolve the CommandPipeline behaviors in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  COMMAND_PIPELINES_BEHAVIOR: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.COMMAND_PIPELINES_BEHAVIOR,
  ),
  /** @description Token used to register and resolve the CompositePipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  COMPOSITE_PIPELINE: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.COMPOSITE_PIPELINE,
  ),
  /** @description Token used to register and resolve the ConcurrencyRetryPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  CONCURRENCY_RETRY_PIPELINE: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.CONCURRENCY_RETRY_PIPELINE,
  ),
  /** @description Token used to register and resolve the ConcurrencyService instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  CONCURRENCY_SERVICE: TokenHelper.createToken<IConcurrencyService>(TOKENS.CONCURRENCY_SERVICE),
  /** @description Token used to register and resolve the ConsoleLogger instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  CONSOLE_LOGGER: TokenHelper.createToken<ILoggerClient>(TOKENS.CONSOLE_LOGGER),
  /** @description Token used to register and resolve the DbClient instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  DB_CLIENT: TokenHelper.createToken<IDbClient>(TOKENS.DB_CLIENT),
  /** @description Token used to register and resolve the ExceptionPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  EXCEPTION_PIPELINE: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.EXCEPTION_PIPELINE,
  ),
  /** @description Token used to register and resolve the GateKeeper instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  GATE_KEEPER: TokenHelper.createToken<IGateKeeper>(TOKENS.GATE_KEEPER),
  /** @description Token used to register and resolve the IdempotencyPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  IDEMPOTENCY_PIPELINE: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.IDEMPOTENCY_PIPELINE,
  ),
  /** @description Token used to register and resolve the IdempotencyStore instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  IDEMPOTENCY_STORE: TokenHelper.createToken<IIdempotencyStore>(TOKENS.IDEMPOTENCY_STORE),
  /** @description Token used to register and resolve the Logger instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  LOGGER: TokenHelper.createToken<ILogger>(TOKENS.LOGGER),
  /** @description Token used to register and resolve the LoggerConfig instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  LOGGER_CONFIG: TokenHelper.createToken<LoggerConfig>(TOKENS.LOGGER_CONFIG),
  /** @description Token used to register and resolve the LoggingPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  LOGGING_PIPELINE: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.LOGGING_PIPELINE,
  ),
  /** @description Token used to register and resolve the Mediator instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  MEDIATOR: TokenHelper.createToken<IMediator>(TOKENS.MEDIATOR),
  /** @description Token used to register and resolve the RequestContextMiddleware in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  MIDDLEWARE: TokenHelper.createToken<IMiddleware<HttpHeaders>>(TOKENS.REQUEST_CONTEXT_MIDDLEWARE),
  /** @description Token used to register and resolve the PerformancePipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  PERFORMANCE_PIPELINE: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.PERFORMANCE_PIPELINE,
  ),
  /** @description Token used to register and resolve the PermissionAuthorizationPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  PERMISSION_AUTHORIZATION_PIPELINE: TokenHelper.createToken<BaseAuthorizationStrategy<IRequest>>(
    TOKENS.PERMISSION_AUTHORIZATION_PIPELINE,
  ),
  /** @description Token used to register and resolve the PinoLogger instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  PINO_LOGGER: TokenHelper.createToken<ILoggerClient>(TOKENS.PINO_LOGGER),
  /** @description Token used to register and resolve the PolicyRegistry instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  POLICY_REGISTRY: TokenHelper.createToken<IPolicyRegistry>(TOKENS.POLICY_REGISTRY),
  /** @description Token used to register and resolve the QueryCachingPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  QUERY_CACHING_PIPELINE: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.QUERY_CACHING_PIPELINE,
  ),
  /** @description Token used to register and resolve the QueryPipeline behaviors in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  QUERY_PIPELINES_BEHAVIOR: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.QUERY_PIPELINES_BEHAVIOR,
  ),
  /** @description Token used to register and resolve the RequestContext instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  REQUEST_CONTEXT: TokenHelper.createToken<IRequestContext<ExecutionContext>>(
    TOKENS.REQUEST_CONTEXT,
  ),
  /** @description Token used to register and resolve the IServiceResilience instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  RESILIENCE_CLIENT: TokenHelper.createToken<IServiceResilience>(TOKENS.RESILIENCE_CLIENT),
  /** @description Token used to register and resolve the RoleAuthorizationPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  ROLE_AUTHORIZATION_PIPELINE: TokenHelper.createToken<BaseAuthorizationStrategy<IRequest>>(
    TOKENS.ROLE_AUTHORIZATION_PIPELINE,
  ),
  /** @description Token used to register and resolve the SchemaValidationStrategy instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  SCHEMA_VALIDATION_STRATEGY: TokenHelper.createToken<BaseValidationStrategy>(
    TOKENS.SCHEMA_VALIDATION_STRATEGY,
  ),
  /** @description Token used to register and resolve the SentryLogger instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  SENTRY_LOGGER: TokenHelper.createToken<ILoggerClient>(TOKENS.SENTRY_LOGGER),
  /** @description Token used to register and resolve the ServiceContainer instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  SERVICE_CONTAINER: TokenHelper.createToken<IServiceContainer>(TOKENS.SERVICE_CONTAINER),
  /** @description Token used to register and resolve the ServiceExtractor instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  SERVICE_EXTRACTOR: TokenHelper.createToken<IServiceExtractor<HttpHeaders, Metadata>>(
    TOKENS.SERVICE_EXTRACTOR,
  ),
  /** @description Token used to register and resolve the ServiceScopeFactory instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  SERVICE_SCOPE_FACTORY: TokenHelper.createToken<IFactory<void, IServiceScope>>(
    TOKENS.SERVICE_SCOPE_FACTORY,
  ),
  /** @description Token used to register and resolve the TenantAuthorizationPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  TENANT_AUTHORIZATION_PIPELINE: TokenHelper.createToken<BaseAuthorizationStrategy<IRequest>>(
    TOKENS.TENANT_AUTHORIZATION_PIPELINE,
  ),
  /** @description Token used to register and resolve the UserAuthorizationPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  USER_AUTHORIZATION_PIPELINE: TokenHelper.createToken<BaseAuthorizationStrategy<IRequest>>(
    TOKENS.USER_AUTHORIZATION_PIPELINE,
  ),
  /** @description Token used to register and resolve the ValidationPipeline instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  VALIDATION_PIPELINE: TokenHelper.createToken<IPipelineBehavior<IRequest, unknown>>(
    TOKENS.VALIDATION_PIPELINE,
  ),
  /** @description Token used to register and resolve the ZodValidator instance in the dependency injection container.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  ZOD_VALIDATOR: TokenHelper.createToken<IValidatorService>(TOKENS.ZOD_VALIDATOR),
} as const)
