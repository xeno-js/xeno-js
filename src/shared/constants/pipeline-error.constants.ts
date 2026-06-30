/**
 * @description Constants related to pipeline errors, including error codes and their corresponding messages, used across the CQRS pipelines to standardize error handling and logging.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export const PIPELINE_ERROR_CODES = Object.freeze({
  /** Indicates a system-level exception occurred during the execution of a pipeline, which was not handled by any specific behavior and resulted in an unexpected error. This error code is used to categorize and log such exceptions for further analysis and debugging.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  SYSTEM_EXCEPTION: 'PIPELINE_SYSTEM_EXCEPTION',

  /** Indicates that the user is not authorized to perform the requested action, typically due to insufficient permissions or lack of authentication. This error code is used in authorization-related pipeline behaviors to signal that access has been denied.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  AUTHORIZATION_FAILED: 'AUTHORIZATION_FAILED',

  /** Indicates that the user is not authenticated, meaning they have not provided valid credentials or a valid authentication token. This error code is used in authentication-related pipeline behaviors to signal that the user must authenticate before accessing the requested resource or performing the action.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  AUTH_UNAUTHENTICATED: 'AUTH_UNAUTHENTICATED',

  /** Indicates that the user is authenticated but does not have the necessary permissions to perform the requested action. This error code is used in authorization-related pipeline behaviors to signal that access has been denied due to insufficient permissions, even though the user is authenticated.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',

  /** Indicates that a concurrency conflict occurred during the execution of a pipeline, typically when multiple requests are trying to modify the same resource simultaneously. This error code is used in concurrency-related pipeline behaviors to signal that a conflict was detected and that the operation could not be completed due to concurrent modifications.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  CONCURRENCY_CONFLICT: 'CONCURRENCY_CONFLICT',

  /** Indicates that a validation error occurred during the execution of a pipeline, typically when the incoming request does not meet the required validation criteria. This error code is used in validation-related pipeline behaviors to signal that the request is invalid and cannot be processed further.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  /** Indicates that an unexpected error occurred during the execution of a pipeline, which does not fall into any of the specific categories defined by the other error codes. This error code is used as a catch-all for unhandled exceptions and can be used for logging and monitoring purposes to identify issues that may require attention.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const)

type PipelineErrorCode = (typeof PIPELINE_ERROR_CODES)[keyof typeof PIPELINE_ERROR_CODES]

/** A mapping of pipeline error codes to their corresponding message keys, which can be used for localization and consistent error messaging across the application. Each key corresponds to a specific error code defined in PIPELINE_ERROR_CODES, allowing for easy retrieval of user-friendly error messages based on the error code encountered during pipeline execution.
 *
 * @author Gantry5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/Gantry5
 */
export const PIPELINE_ERROR_CODES_KEYS: Record<PipelineErrorCode, string> = Object.freeze({
  /** The message key for the SYSTEM_EXCEPTION error code, which can be used to retrieve a localized error message indicating that a system-level exception occurred during pipeline execution. This key should correspond to an entry in the application's localization files, providing a user-friendly description of the error when it is encountered.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  [PIPELINE_ERROR_CODES.SYSTEM_EXCEPTION]: 'errors.pipelines.system_exception',

  /** The message key for the AUTHORIZATION_FAILED error code, which can be used to retrieve a localized error message indicating that the user is not authorized to perform the requested action. This key should correspond to an entry in the application's localization files, providing a user-friendly description of the error when it is encountered.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  [PIPELINE_ERROR_CODES.AUTHORIZATION_FAILED]: 'errors.pipelines.authorization_failed',

  /** The message key for the AUTH_UNAUTHENTICATED error code, which can be used to retrieve a localized error message indicating that the user is not authenticated. This key should correspond to an entry in the application's localization files, providing a user-friendly description of the error when it is encountered.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  [PIPELINE_ERROR_CODES.AUTH_UNAUTHENTICATED]: 'errors.pipelines.unauthenticated',

  /** The message key for the AUTH_FORBIDDEN error code, which can be used to retrieve a localized error message indicating that the user is authenticated but does not have the necessary permissions to perform the requested action. This key should correspond to an entry in the application's localization files, providing a user-friendly description of the error when it is encountered.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  [PIPELINE_ERROR_CODES.AUTH_FORBIDDEN]: 'errors.pipelines.forbidden',

  /** The message key for the CONCURRENCY_CONFLICT error code, which can be used to retrieve a localized error message indicating that a concurrency conflict occurred during pipeline execution. This key should correspond to an entry in the application's localization files, providing a user-friendly description of the error when it is encountered.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  [PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT]: 'errors.pipelines.concurrency_conflict',

  /** The message key for the VALIDATION_ERROR error code, which can be used to retrieve a localized error message indicating that a validation error occurred during pipeline execution. This key should correspond to an entry in the application's localization files, providing a user-friendly description of the error when it is encountered.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  [PIPELINE_ERROR_CODES.VALIDATION_ERROR]: 'errors.pipelines.validation_error',

  /** The message key for the UNEXPECTED_ERROR error code, which can be used to retrieve a localized error message indicating that an unexpected error occurred during pipeline execution. This key should correspond to an entry in the application's localization files, providing a user-friendly description of the error when it is encountered.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  [PIPELINE_ERROR_CODES.UNEXPECTED_ERROR]: 'errors.pipelines.unexpected_error',
} as const)
