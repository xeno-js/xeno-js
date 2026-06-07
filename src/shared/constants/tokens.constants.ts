/**
 * @description This file defines the tokens used for dependency injection in the application.
 * Tokens are unique identifiers that are used to register and resolve dependencies in the container.
 * They can be symbols, strings, or classes, but using symbols is a common practice to avoid naming collisions.
 */
export const TOKENS = Object.freeze({
  /** @description Token used to register and resolve pipeline behaviors in the dependency injection container. */
  PIPELINES_BEHAVIOR: Symbol('PIPELINES_BEHAVIOR'),
  MEDIATOR: Symbol('MEDIATOR'),
  LOGGER: Symbol('LOGGER'),
  REQUEST_CONTEXT: Symbol('REQUEST_CONTEXT'),
  REDIS_CACHE: Symbol('REDIS_CACHE'),
  PINO_LOGGER: Symbol('PINO_LOGGER'),
  SENTRY_LOGGER: Symbol('SENTRY_LOGGER'),
} as const)
