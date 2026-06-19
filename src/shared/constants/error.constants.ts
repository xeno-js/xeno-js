/**
 * @description Machine-readable, kebab-case error codes for all cross-cutting failures.
 * Used by AppError and Result to communicate failure semantics across layer boundaries
 * without relying on human-readable strings.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export const ERROR_CODES = Object.freeze({
  // ── Generic / System ─────────────────────────────────────────────────────

  /** @description Unclassified or unexpected infrastructure-level failure.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  SYSTEM_ERROR: 'SYSTEM_ERROR',

  /** @description An operation that has not yet been implemented was invoked.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',

  /** @description An external API call failed due to network issues or a 5xx response.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

  /** @description One or more input fields failed invariant or schema validation.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  VALIDATION_FAILED: 'VALIDATION_FAILED',

  /** @description Authentication failed due to invalid credentials or token.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',

  /** @description The caller is not authenticated.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  UNAUTHORIZED: 'UNAUTHORIZED',

  /** @description The caller is authenticated but lacks the required permissions.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  FORBIDDEN: 'FORBIDDEN',

  /** @description The request was well-formed but semantically invalid.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  BAD_REQUEST: 'BAD_REQUEST',

  /** @description The request was aborted before it could be processed.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  ABORTED: 'ABORTED',

  /** @description Required service scope is not available in the request context.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  SCOPE_NOT_AVAILABLE: 'SCOPE_NOT_AVAILABLE',
} as const)

/** @description Inferred union of every valid ERROR_CODES value.
 *
 * @author Mattia Carcione
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/gear5
 */
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Canonical HTTP status codes used across Presentation and Infrastructure layers.
 * Centralising these values prevents magic-number sprawl and ensures
 * consistent semantics between the AppError, Result and ApiResponse contracts.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export const STATUS_CODES = Object.freeze({
  // ── 2xx Success ───────────────────────────────────────────────────────────

  /** @description The request succeeded and a response body is present.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  OK: 200,

  /** @description A new resource has been successfully created.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  CREATED: 201,

  /** @description The request succeeded but there is no response body (e.g. DELETE).
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  NO_CONTENT: 204,

  // ── 4xx Client Errors ─────────────────────────────────────────────────────

  /** @description The request payload is malformed or contains invalid parameters.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  BAD_REQUEST: 400,

  /** @description Authentication credentials are missing or invalid.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  UNAUTHORIZED: 401,

  /** @description The caller lacks permission to perform the requested operation.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  FORBIDDEN: 403,

  /** @description The requested resource does not exist.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  NOT_FOUND: 404,

  /** @description The request conflicts with the current state of the resource.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  CONFLICT: 409,

  /** @description The payload is syntactically valid but semantically unprocessable.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  UNPROCESSABLE_ENTITY: 422,

  /** @description The caller has exceeded its allowed rate limit.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  TOO_MANY_REQUESTS: 429,

  /** @description The client closed the connection before the server finished responding.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  ABORTED: 499,

  // ── 5xx Server Errors ─────────────────────────────────────────────────────

  /** @description An unexpected condition was encountered by the server.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  INTERNAL_SERVER_ERROR: 500,

  /** @description A downstream dependency is temporarily unavailable.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  SERVICE_UNAVAILABLE: 503,
} as const)

/** @description Inferred union of every valid STATUS_CODES value.
 *
 * @author Mattia Carcione
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/gear5
 */
export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES]

/**
 * @description A mapping of ERROR_CODES to human-readable messages, used for logging and user feedback when an AppError is created with a specific error code. This allows for consistent and centralized management of error messages across the application, ensuring that each error code corresponds to a clear and descriptive message that can be easily maintained and localized if necessary.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
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
} as const)
