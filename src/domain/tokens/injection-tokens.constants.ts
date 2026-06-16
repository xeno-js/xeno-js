import type {
  ExecutionContext,
  IGateKeeper,
  ILogger,
  ILoggerClient,
  IMediator,
  IMiddleware,
  IRequestContext,
  IServiceContainer,
  IServiceExtractor,
  LoggerConfig,
} from '@/domain'
import type { HttpHeaders, Metadata, Optional } from '@/shared'
import { TokenHelper, TOKENS } from '@/shared'

/**
 * @description This file defines the injection tokens used for dependency injection in the application.
 * Injection tokens are unique identifiers that are used to register and resolve dependencies in the container.
 * They can be symbols, strings, or classes, but using symbols is a common practice to avoid naming collisions.
 */
export const INJECTION_TOKENS = Object.freeze({
  /** @description Token used to register and resolve the RequestContextMiddleware in the dependency injection container. */
  MIDDLEWARE: TokenHelper.createToken<IMiddleware<HttpHeaders>>(TOKENS.REQUEST_CONTEXT_MIDDLEWARE),
  /** @description Token used to register and resolve the RequestContext instance in the dependency injection container. */
  REQUEST_CONTEXT: TokenHelper.createToken<IRequestContext<ExecutionContext>>(
    TOKENS.REQUEST_CONTEXT,
  ),
  /** @description Token used to register and resolve the ServiceExtractor instance in the dependency injection container. */
  SERVICE_EXTRACTOR: TokenHelper.createToken<IServiceExtractor<HttpHeaders, Metadata>>(
    TOKENS.SERVICE_EXTRACTOR,
  ),
  /** @description Token used to register and resolve the BearerTokenExtractor instance in the dependency injection container. */
  BEARER_TOKEN_EXTRACTOR: TokenHelper.createToken<IServiceExtractor<HttpHeaders, Optional<string>>>(
    TOKENS.BEARER_TOKEN_EXTRACTOR,
  ),
  /** @description Token used to register and resolve the GateKeeper instance in the dependency injection container. */
  GATE_KEEPER: TokenHelper.createToken<IGateKeeper>(TOKENS.GATE_KEEPER),
  /** @description Token used to register and resolve the ServiceContainer instance in the dependency injection container. */
  SERVICE_CONTAINER: TokenHelper.createToken<IServiceContainer>(TOKENS.SERVICE_CONTAINER),
  /** @description Token used to register and resolve the Mediator instance in the dependency injection container. */
  MEDIATOR: TokenHelper.createToken<IMediator>(TOKENS.MEDIATOR),
  /** @description Token used to register and resolve the LoggerConfig instance in the dependency injection container. */
  LOGGER_CONFIG: TokenHelper.createToken<LoggerConfig>(TOKENS.LOGGER_CONFIG),
  /** @description Token used to register and resolve the Logger instance in the dependency injection container. */
  LOGGER: TokenHelper.createToken<ILogger>(TOKENS.LOGGER),
  /** @description Token used to register and resolve the ConsoleLogger instance in the dependency injection container. */
  CONSOLE_LOGGER: TokenHelper.createToken<ILoggerClient>(TOKENS.CONSOLE_LOGGER),
  /** @description Token used to register and resolve the SentryLogger instance in the dependency injection container. */
  SENTRY_LOGGER: TokenHelper.createToken<ILoggerClient>(TOKENS.SENTRY_LOGGER),
  /** @description Token used to register and resolve the PinoLogger instance in the dependency injection container. */
  PINO_LOGGER: TokenHelper.createToken<ILoggerClient>(TOKENS.PINO_LOGGER),
} as const)
