import type { AppError, IController, IMediator } from '@/domain'
import type { Optional, ResponseDto } from '@/shared'
import { HttpHelper } from '@/shared'

/**
 * BaseController is an abstract class that implements the IController interface. It provides a foundation for creating specific controllers that handle incoming requests and return responses. The class requires a mediator to facilitate communication between different parts of the application.
 * @template TRequest - The type of the request object that the controller will handle.
 * @template TResponse - The type of the response object that the controller will return.
 *
 * @author XenoJS
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/XenoJS
 */
export abstract class BaseController<TRequest, TResponse> implements IController<
  TRequest,
  TResponse
> {
  constructor(protected readonly _mediator: IMediator) {}

  abstract handle(request: TRequest): Promise<ResponseDto<TResponse>>

  /**
   * Helper to return a successful 200/201 response.
   * @param data - The data to include in the response.
   * @param status - The HTTP status code (default is 200).
   * @returns A ResponseDto containing the data and status.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  protected ok<T>(data: T, status = 200): ResponseDto<T> {
    return HttpHelper.success(data, status)
  }

  /**
   * Helper to automatically map a failed Result (from the CQRS pipeline)
   * into a standardized ErrorResponseDto.
   * @param error - The AppError instance representing the error.
   * @param details - Optional additional details about the error.
   * @returns A ResponseDto representing the error response.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  protected fail(error: AppError, details: Optional<string>): ResponseDto {
    return HttpHelper.error({
      code: error.code,
      message: error.message,
      status: error.status,
      details,
      correlationId: undefined,
      requestId: undefined,
      customHeaders: undefined,
    })
  }
}
