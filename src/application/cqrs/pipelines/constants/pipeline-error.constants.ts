/**
 * @description Constants related to pipeline errors, including error codes and their corresponding messages, used across the CQRS pipelines to standardize error handling and logging.
 */
export const PIPELINE_ERROR_CODES = Object.freeze({
  /** Indicates a system-level exception occurred during the execution of a pipeline, which was not handled by any specific behavior and resulted in an unexpected error. This error code is used to categorize and log such exceptions for further analysis and debugging. */
  SYSTEM_EXCEPTION: 'PIPELINE_SYSTEM_EXCEPTION',

  /** Indicates that the user is not authorized to perform the requested action, typically due to insufficient permissions or lack of authentication. This error code is used in authorization-related pipeline behaviors to signal that access has been denied. */
  AUTHORIZATION_FAILED: 'AUTHORIZATION_FAILED',
} as const)

type PipelineErrorCode = (typeof PIPELINE_ERROR_CODES)[keyof typeof PIPELINE_ERROR_CODES]

/** A mapping of pipeline error codes to their corresponding message keys, which can be used for localization and consistent error messaging across the application. Each key corresponds to a specific error code defined in PIPELINE_ERROR_CODES, allowing for easy retrieval of user-friendly error messages based on the error code encountered during pipeline execution. */
export const PIPELINE_ERROR_CODES_KEYS: Record<PipelineErrorCode, string> = {
  /** The message key for the SYSTEM_EXCEPTION error code, which can be used to retrieve a localized error message indicating that a system-level exception occurred during pipeline execution. This key should correspond to an entry in the application's localization files, providing a user-friendly description of the error when it is encountered. */
  [PIPELINE_ERROR_CODES.SYSTEM_EXCEPTION]: 'errors.pipelines.system_exception',

  /** The message key for the AUTHORIZATION_FAILED error code, which can be used to retrieve a localized error message indicating that the user is not authorized to perform the requested action. This key should correspond to an entry in the application's localization files, providing a user-friendly description of the error when it is encountered. */
  [PIPELINE_ERROR_CODES.AUTHORIZATION_FAILED]: 'errors.pipelines.authorization_failed',
} as const
