import type { IBaseRequest, IStrategy, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import { PIPELINE_ERROR_CODES, PIPELINE_ERROR_CODES_KEYS, STATUS_CODES } from '@/shared'

/**
 * @description Abstract base class for validation strategies in the CQRS pipeline. This class implements the IStrategy interface and provides a common structure for performing validation checks based on the input request. It defines an abstract method performValidationCheck that must be implemented by concrete validation strategies to specify the logic for checking if the request meets the necessary validation criteria. The execute method retrieves the input request and ensures that it is valid before delegating to the performValidationCheck method for further validation. If the request is not valid, it returns a failed Result with an appropriate AppError indicating that validation is required.
 */
export abstract class BaseValidationStrategy implements IStrategy<boolean> {
  public abstract isApplicable(context: IBaseRequest): boolean

  public abstract execute(request: IBaseRequest): Promise<ResultType<boolean>>

  /**
   * @description Helper method to create a standardized AppError for validation failures. This method can be used by concrete validation strategies to generate consistent error responses when validation checks fail. It takes the original request and a custom message as parameters and returns a Result containing an AppError with the appropriate error code, message, status, and cause.
   * @param request The original request for which the validation check failed. This is used to extract information such as the request type for logging and error reporting purposes.
   * @param message A custom message describing the reason for the validation failure. This message is included in the AppError's cause for detailed error reporting.
   * @returns A Result containing an AppError with the appropriate error code, message, status, and cause.
   */
  protected createValidationError(request: IBaseRequest, message: string): ResultType<boolean> {
    return Result.fail(
      AppError.create({
        code: PIPELINE_ERROR_CODES.VALIDATION_ERROR,
        message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.VALIDATION_ERROR],
        status: STATUS_CODES.BAD_REQUEST,
        name: request.token.symbol.toString(),
        cause: new Error(message),
      }),
    )
  }
}
