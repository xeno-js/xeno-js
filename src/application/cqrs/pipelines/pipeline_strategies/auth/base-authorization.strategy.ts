import type {
  ExecutionContext,
  IBaseRequest,
  Identity,
  IRequestContext,
  IStrategy,
  ResultType,
} from '@/domain'
import { AppError, Result } from '@/domain'
import { Guards, PIPELINE_ERROR_CODES, PIPELINE_ERROR_CODES_KEYS, STATUS_CODES } from '@/shared'

/**
 * @description Abstract base class for authorization strategies in the CQRS pipeline. This class implements the IStrategy interface and provides a common structure for performing authorization checks based on the identity of the authenticated user. It defines an abstract method performAuthorizationCheck that must be implemented by concrete authorization strategies to specify the logic for checking if the user has the necessary permissions to execute a given request. The execute method retrieves the user's identity from the request context and ensures that the user is authenticated before delegating to the performAuthorizationCheck method for further authorization validation. If the user is not authenticated, it returns a failed Result with an appropriate AppError indicating that authentication is required.
 */
export abstract class BaseAuthorizationStrategy<
  TInput extends IBaseRequest,
> implements IStrategy<TInput> {
  /**
   * @description Constructs a new instance of the BaseAuthorizationStrategy class, which serves as an abstract base for specific authorization strategies in the CQRS pipeline. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated user during the authorization process. This context is essential for performing the authorization checks based on the user's identity when executing requests that require specific permissions.
   * @param requestContext An instance of IRequestContext used to access the identity of the currently authenticated user. This context is essential for performing the authorization checks based on the user's identity when executing requests that require specific permissions.
   */
  constructor(private readonly _requestContext: IRequestContext<ExecutionContext>) {}

  public abstract isApplicable(context: IBaseRequest): context is TInput

  public async execute(request: IBaseRequest): Promise<ResultType<void>> {
    const ctx = this._requestContext.getContext()
    if (!Guards.isDefined(ctx) || !Guards.isDefined(ctx.identity)) {
      return Result.fail(
        AppError.create({
          code: PIPELINE_ERROR_CODES.AUTHORIZATION_FAILED,
          message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.AUTHORIZATION_FAILED],
          status: STATUS_CODES.UNAUTHORIZED,
          name: request.intent,
          cause: new Error('User is not authenticated'),
        }),
      )
    }

    return this.performAuthorizationCheck(request, ctx.identity)
  }

  /**
   * @description Abstract method that must be implemented by concrete authorization strategies to perform the actual authorization check. This method is called after the user's identity has been retrieved and verified. It receives the request and the user's identity as parameters and should return a Result indicating whether the authorization check passed or failed.
   * @param request The incoming request for which the authorization check is being performed. This request contains information about the action being attempted and any relevant data needed for the authorization logic.
   * @param ctx The identity of the currently authenticated user, which includes information such as the user's ID, tenant ID, and roles. This context is used to determine if the user has the necessary permissions to execute the request.
   * @returns A Result indicating the outcome of the authorization check. If the check passes, it should return a successful Result with a void value. If the check fails, it should return a failed Result with an appropriate AppError describing the reason for the failure.
   */
  protected abstract performAuthorizationCheck(
    request: IBaseRequest,
    auth: Identity,
  ): ResultType<void>

  /**
   * @description Helper method to create a standardized AppError for authorization failures. This method can be used by concrete authorization strategies to generate consistent error responses when authorization checks fail. It takes the original request and a custom message as parameters and returns a Result containing an AppError with the appropriate error code, message, status, and cause.
   * @param request The original request for which the authorization check failed. This is used to extract information such as the request type for logging and error reporting purposes.
   * @param message A custom message describing the reason for the authorization failure. This message is included in the AppError's cause for detailed error reporting.
   * @returns A Result containing an AppError with the appropriate error code, message, status, and cause.
   */
  protected createAuthError(request: IBaseRequest, message: string): ResultType<void> {
    return Result.fail(
      AppError.create({
        code: PIPELINE_ERROR_CODES.AUTH_FORBIDDEN,
        message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.AUTH_FORBIDDEN],
        status: STATUS_CODES.FORBIDDEN,
        name: request.intent,
        cause: new Error(message),
      }),
    )
  }
}
