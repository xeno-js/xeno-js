/**
 * @description This file defines the tokens used for dependency injection in the application.
 * Tokens are unique identifiers that are used to register and resolve dependencies in the container.
 * They can be symbols, strings, or classes, but using symbols is a common practice to avoid naming collisions.
 */
export const TOKENS = Object.freeze({
  /** @description Token used to register and resolve command pipeline behaviors in the dependency injection container. */
  COMMAND_PIPELINES_BEHAVIOR: 'COMMAND_PIPELINES_BEHAVIOR',
  /** @description Token used to register and resolve query pipeline behaviors in the dependency injection container. */
  QUERY_PIPELINES_BEHAVIOR: 'QUERY_PIPELINES_BEHAVIOR',
  /** @description Token used to register and resolve the Mediator instance in the dependency injection container. */
  MEDIATOR: 'MEDIATOR',
  /** @description Token used to register and resolve the Logger instance in the dependency injection container. */
  LOGGER: 'LOGGER',
  /** @description Token used to register and resolve the Request Context instance in the dependency injection container. */
  REQUEST_CONTEXT: 'REQUEST_CONTEXT',
  /** @description Token used to register and resolve the Redis Cache instance in the dependency injection container. */
  REDIS_CACHE: 'REDIS_CACHE',
  /** @description Token used to register and resolve the Pino Logger instance in the dependency injection container. */
  PINO_LOGGER: 'PINO_LOGGER',
  /** @description Token used to register and resolve the Sentry Logger instance in the dependency injection container. */
  SENTRY_LOGGER: 'SENTRY_LOGGER',
} as const)
