import type { Delegate, IPipelineBehavior, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import type { IBaseRequest } from '@/shared'
import {
  DEFAULT_CONCURRENCY,
  Guards,
  PIPELINE_ERROR_CODES,
  PIPELINE_ERROR_CODES_KEYS,
  PromiseHelper,
  STATUS_CODES,
} from '@/shared'

/**
 * @description A pipeline behavior that implements a retry mechanism for handling concurrency conflicts in the CQRS pipelines. When a request results in a concurrency conflict error, this behavior will automatically retry the request up to a specified maximum number of attempts, with an exponential backoff strategy and added jitter to prevent thundering herd problems. If the maximum number of retry attempts is exceeded, it returns a failed Result with an AppError indicating the concurrency conflict.
 */
export class ConcurrencyRetryPipeline<
  TInput extends IBaseRequest,
  TResult,
> implements IPipelineBehavior<TInput, TResult> {
  /**
   * @description Configuration for the retry mechanism, including the base delay and maximum jitter for calculating the delay between retry attempts, as well as the maximum number of retry attempts allowed before giving up and returning a failed Result with an AppError indicating the concurrency conflict.
   */
  private readonly _delayConfig: { baseDelayMs: number; maxJitterMs: number }
  /**
   * @description Maximum number of retry attempts for handling concurrency conflicts. If the number of attempts exceeds this value, the pipeline will return a failed Result with an AppError indicating that the maximum retry attempts have been exceeded due to concurrency conflicts.
   */
  private readonly _maxRetries: number

  /**
   * @description Constructs a new instance of the ConcurrencyRetryBehavior class, which takes an optional maximum number of retry attempts and an optional delay configuration for the exponential backoff strategy. The delay configuration includes a base delay in milliseconds and a maximum jitter in milliseconds to be added to the base delay for each retry attempt. The constructor validates the input parameters to ensure that they are positive integers and throws an error if they are not.
   * @param maxRetries An optional parameter that specifies the maximum number of retry attempts for handling concurrency conflicts. The default value is DEFAULT_CONCURRENCY.MAX_RETRIES. It must be a positive integer.
   * @param delayConfig An optional parameter that specifies the delay configuration for the exponential backoff strategy, including a base delay in milliseconds and a maximum jitter in milliseconds. The default values are DEFAULT_CONCURRENCY.BASE_DELAY for the base delay and DEFAULT_CONCURRENCY.MAX_JITTER for the maximum jitter. Both values must be non-negative integers.
   * @throws Will throw an error if the provided maxRetries value is not a positive integer or if the provided delayConfig values are not valid non-negative integers.
   */
  constructor(
    maxRetries: number = DEFAULT_CONCURRENCY.MAX_RETRIES,
    delayConfig: { baseDelayMs: number; maxJitterMs: number } = {
      baseDelayMs: DEFAULT_CONCURRENCY.BASE_DELAY,
      maxJitterMs: DEFAULT_CONCURRENCY.MAX_JITTER,
    },
  ) {
    const values: number[] = [maxRetries, delayConfig.baseDelayMs, delayConfig.maxJitterMs]
    const errorMessages = [
      `Invalid maxRetries value: ${maxRetries}. It must be a positive integer.`,
      `Invalid baseDelayMs value: ${delayConfig.baseDelayMs}. It must be a non-negative integer.`,
      `Invalid maxJitterMs value: ${delayConfig.maxJitterMs}. It must be a non-negative integer.`,
    ]

    values.forEach((value, index) => {
      Guards.throwIfNotInteger(value, errorMessages[index])
      Guards.throwIfNegative(value, errorMessages[index])
      if (index === 0 && value === 0) {
        throw new Error(errorMessages[index])
      }
    })

    this._maxRetries = maxRetries
    this._delayConfig = delayConfig
  }

  /**
   * @description Handles the request by implementing a retry mechanism for concurrency conflicts. It retries the request up to the maximum number of attempts with an exponential backoff strategy and added jitter. If the request succeeds or fails with an error that is not a concurrency conflict, it returns the result immediately. If the maximum number of retry attempts is exceeded due to concurrency conflicts, it returns a failed Result with an AppError indicating the concurrency conflict.
   * @param request The input request to be handled, which must extend IBaseRequest.
   * @param next The delegate function that represents the next behavior or handler in the pipeline.
   * @returns A Promise that resolves to a ResultType containing either the successful result or a failed AppError if the maximum retry attempts are exceeded due to concurrency conflicts.
   */
  public async handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>> {
    let attempts = 0

    while (true) {
      attempts++

      const result = await next()

      if (result.isOk() || !this.isConcurrencyError(result.getErrorOrThrow())) return result

      if (attempts >= this._maxRetries)
        return Result.fail(
          AppError.create({
            code: PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT,
            message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT],
            status: STATUS_CODES.CONFLICT,
            name: request.intent,
            cause: new Error(
              `Maximum retry attempts (${this._maxRetries}) exceeded due to concurrency conflicts.`,
            ),
          }),
        )

      const { baseDelayMs, maxJitterMs } = this._delayConfig

      await PromiseHelper.delayWithJitter(baseDelayMs, maxJitterMs)
    }
  }

  /**
   * @description Checks if the given error is a concurrency conflict error.
   * @param error The error to be checked.
   * @returns A boolean indicating whether the error is a concurrency conflict error.
   */
  private isConcurrencyError(error: AppError): boolean {
    return (
      error.code === PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT &&
      error.status === STATUS_CODES.CONFLICT
    )
  }
}
