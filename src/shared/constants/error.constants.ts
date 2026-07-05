/**
 * @description Machine-readable, kebab-case error codes for all cross-cutting failures.
 * Used by AppError and Result to communicate failure semantics across layer boundaries
 * without relying on human-readable strings.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const ERROR_CODES = Object.freeze({
  // ── Generic / System ─────────────────────────────────────────────────────

  /** @description Unclassified or unexpected infrastructure-level failure.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  SYSTEM_ERROR: 'SYSTEM_ERROR',

  /** @description An operation that has not yet been implemented was invoked.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',

  /** @description An external API call failed due to network issues or a 5xx response.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

  /** @description One or more input fields failed invariant or schema validation.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  VALIDATION_FAILED: 'VALIDATION_FAILED',

  /** @description Authentication failed due to invalid credentials or token.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',

  /** @description The caller is not authenticated.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  UNAUTHORIZED: 'UNAUTHORIZED',

  /** @description The caller is authenticated but lacks the required permissions.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  FORBIDDEN: 'FORBIDDEN',

  /** @description The request was well-formed but semantically invalid.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  BAD_REQUEST: 'BAD_REQUEST',

  /** @description The request was aborted before it could be processed.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  ABORTED: 'ABORTED',

  /** @description Required service scope is not available in the request context.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  SCOPE_NOT_AVAILABLE: 'SCOPE_NOT_AVAILABLE',

  /** @description The request conflicts with the current state of the resource.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CONFLICT: 'CONFLICT',
  /** @description The requested resource does not exist.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  NOT_FOUND: 'NOT_FOUND',
} as const)

/** @description Inferred union of every valid ERROR_CODES value.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Canonical HTTP status codes used across Presentation and Infrastructure layers.
 * Centralising these values prevents magic-number sprawl and ensures
 * consistent semantics between the AppError, Result and ApiResponse contracts.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const STATUS_CODES = Object.freeze({
  // ── 2xx Success ───────────────────────────────────────────────────────────

  /** @description The request succeeded and a response body is present.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  OK: 200,

  /** @description A new resource has been successfully created.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CREATED: 201,

  /** @description The request succeeded but there is no response body (e.g. DELETE).
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  NO_CONTENT: 204,

  // ── 4xx Client Errors ─────────────────────────────────────────────────────

  /** @description The request payload is malformed or contains invalid parameters.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  BAD_REQUEST: 400,

  /** @description Authentication credentials are missing or invalid.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  UNAUTHORIZED: 401,

  /** @description The caller lacks permission to perform the requested operation.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  FORBIDDEN: 403,

  /** @description The requested resource does not exist.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  NOT_FOUND: 404,

  /** @description The request conflicts with the current state of the resource.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CONFLICT: 409,

  /** @description The payload is syntactically valid but semantically unprocessable.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  UNPROCESSABLE_ENTITY: 422,

  /** @description The caller has exceeded its allowed rate limit.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  TOO_MANY_REQUESTS: 429,

  /** @description The client closed the connection before the server finished responding.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  ABORTED: 499,

  // ── 5xx Server Errors ─────────────────────────────────────────────────────

  /** @description An unexpected condition was encountered by the server.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  INTERNAL_SERVER_ERROR: 500,

  /** @description A downstream dependency is temporarily unavailable.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  SERVICE_UNAVAILABLE: 503,
} as const)

/** @description Inferred union of every valid STATUS_CODES value.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES]

/**
 * @description A mapping of ERROR_CODES to human-readable messages, used for logging and user feedback when an AppError is created with a specific error code. This allows for consistent and centralized management of error messages across the application, ensuring that each error code corresponds to a clear and descriptive message that can be easily maintained and localized if necessary.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const ERROR_CODE_MESSAGES: Record<ErrorCode, string> = Object.freeze({
  [ERROR_CODES.SYSTEM_ERROR]: 'errors.system_error',
  [ERROR_CODES.NOT_IMPLEMENTED]: 'errors.not_implemented',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'errors.external_service_error',
  [ERROR_CODES.VALIDATION_FAILED]: 'errors.validation_failed',
  [ERROR_CODES.UNAUTHORIZED]: 'errors.unauthorized',
  [ERROR_CODES.FORBIDDEN]: 'errors.forbidden',
  [ERROR_CODES.BAD_REQUEST]: 'errors.bad_request',
  [ERROR_CODES.ABORTED]: 'errors.aborted',
  [ERROR_CODES.AUTHENTICATION_FAILED]: 'errors.authentication_failed',
  [ERROR_CODES.SCOPE_NOT_AVAILABLE]: 'errors.scope_not_available',
  [ERROR_CODES.CONFLICT]: 'errors.conflict',
  [ERROR_CODES.NOT_FOUND]: 'errors.not_found',
} as const)
