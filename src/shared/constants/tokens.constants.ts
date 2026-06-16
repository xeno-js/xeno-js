/**
 * @description This file defines the tokens used for dependency injection in the application.
 * Tokens are unique identifiers that are used to register and resolve dependencies in the container.
 * They can be symbols, strings, or classes, but using symbols is a common practice to avoid naming collisions.
 */
export const TOKENS = Object.freeze({
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
} as const)
