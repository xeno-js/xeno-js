import type {
  Delegate,
  ExecutionContext,
  ICommand,
  IIdempotencyStore,
  IPipelineBehavior,
  IRequestContext,
  ResultType,
} from '@/domain'
import { AppError, Result } from '@/domain'
import {
  Guards,
  IDEMPOTENCY_CONSTANTS,
  PIPELINE_ERROR_CODES,
  PIPELINE_ERROR_CODES_KEYS,
  STATUS_CODES,
} from '@/shared'

/**
 * @description A pipeline behavior that implements idempotency for command requests in the CQRS architecture. This behavior ensures that if multiple requests with the same command ID are received, only one of them will be processed, and the others will receive the same result without reprocessing the command. The pipeline uses an IIdempotencyStore to manage locks and store results for processed commands, allowing it to handle concurrent requests safely and efficiently while preventing duplicate processing of commands. The behavior checks if the incoming request is a command and if it has a valid ID. If the command has already been processed, it retrieves the stored result and returns it. If the command is currently being processed by another request, it returns an error indicating that the command is locked. If the command has not been processed and is not locked, it acquires a lock, processes the command, stores the result, and releases the lock accordingly. The pipeline also includes error handling to ensure that locks are released in case of exceptions during command processing.
 *
 * @author Mattia Carcione //
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/gear5
 */
export class IdempotencyPipeline<TInput extends ICommand, TResult> implements IPipelineBehavior<
  TInput,
  TResult
> {
  /** @description TTL (time-to-live) in seconds for locks acquired in the idempotency mechanism. This value determines how long a lock will be held for a given command ID when it is being processed. If a lock is not released within this time frame, it will automatically expire, allowing other instances of the command to be processed. The default value is set to 300 seconds (5 minutes), which provides a reasonable balance between allowing sufficient time for command processing and preventing long-term locks that could lead to delays in processing subsequent commands with the same ID. This value can be overridden by providing a different lockTtlSeconds value when constructing the IdempotencyPipeline instance.
   *
   * @author Mattia Carcione &&
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  private readonly _lockTtlSeconds: number
  /** @description TTL (time-to-live) in seconds for processed command results stored in the idempotency mechanism. This value determines how long the result of a processed command will be stored and available for retrieval when subsequent requests with the same command ID are received. If a result is not retrieved within this time frame, it will automatically expire and be removed from the store, meaning that subsequent requests with the same command ID will not be able to retrieve the previous result and may need to reprocess the command. The default value is set to 86400 seconds (24 hours), which allows for a reasonable window of time for clients to retrieve results of processed commands while also ensuring that stale results do not persist indefinitely in the store. This value can be overridden by providing a different processedTtlSeconds value when constructing the IdempotencyPipeline instance.
   *
   * @author Mattia Carcione ||
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  private readonly _processedTtlSeconds: number

  /**
   * @description Constructs a new instance of the IdempotencyPipeline class, which requires an IIdempotencyStore for managing locks and storing results of processed commands. The constructor also accepts optional parameters for configuring the TTL (time-to-live) values for locks and processed results, allowing for customization of the idempotency behavior based on the specific needs of the application. The constructor validates the input parameters to ensure that they are positive integers and throws an error if they are not, ensuring that the pipeline is configured with valid TTL values for proper functioning of the idempotency mechanism.
   * @param idempotencyStore An instance of IIdempotencyStore used for managing locks and storing results of processed commands in the idempotency mechanism. This store is essential for ensuring that commands with the same ID are processed in an idempotent manner, allowing the pipeline to handle concurrent requests safely and efficiently while preventing duplicate processing of commands.
   * @param lockTtlSeconds TTL (time-to-live) in seconds for locks acquired in the idempotency mechanism. This value determines how long a lock will be held for a given command ID when it is being processed. If a lock is not released within this time frame, it will automatically expire, allowing other instances of the command to be processed. The default value is set to 300 seconds (5 minutes), which provides a reasonable balance between allowing sufficient time for command processing and preventing long-term locks that could lead to delays in processing subsequent commands with the same ID. This value can be overridden by providing a different lockTtlSeconds value when constructing the IdempotencyPipeline instance.
   * @param processedTtlSeconds TTL (time-to-live) in seconds for processed command results stored in the idempotency mechanism. This value determines how long the result of a processed command will be stored and available for retrieval when subsequent requests with the same command ID are received. If a result is not retrieved within this time frame, it will automatically expire and be removed from the store, meaning that subsequent requests with the same command ID will not be able to retrieve the previous result and may need to reprocess the command. The default value is set to 86400 seconds (24 hours), which allows for a reasonable window of time for clients to retrieve results of processed commands while also ensuring that stale results do not persist indefinitely in the store. This value can be overridden by providing a different processedTtlSeconds value when constructing the IdempotencyPipeline instance.
   * @throws Will throw an error if the provided lockTtlSeconds or processedTtlSeconds values are not positive integers, ensuring that the pipeline is configured with valid TTL values for proper functioning of the idempotency mechanism.
   
   * 
   * @author Mattia Carcione ---
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  constructor(
    private readonly _requestContext: IRequestContext<ExecutionContext>,
    private readonly _idempotencyStore: IIdempotencyStore,
    lockTtlSeconds: number = IDEMPOTENCY_CONSTANTS.DEFAULT_IDEMPOTENCY_LOCK_TTL_SECONDS,
    processedTtlSeconds: number = IDEMPOTENCY_CONSTANTS.DEFAULT_TTL_SECONDS,
  ) {
    const values: number[] = [lockTtlSeconds, processedTtlSeconds]
    const errorMessages = [
      `Invalid lockTtlSeconds value: ${lockTtlSeconds}. It must be a positive integer.`,
      `Invalid processedTtlSeconds value: ${processedTtlSeconds}. It must be a positive integer.`,
    ]
    values.forEach((value, index) => {
      Guards.throwIfNotInteger(value, errorMessages[index])
      Guards.throwIfNegative(value, errorMessages[index])
      if (value === 0) {
        throw new Error(errorMessages[index])
      }
    })

    this._lockTtlSeconds = lockTtlSeconds
    this._processedTtlSeconds = processedTtlSeconds
  }

  public async handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>> {
    const { context } = this._requestContext.getContext() ?? {}
    if (!Guards.isDefined(context))
      return Result.fail(
        AppError.create({
          code: PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT,
          message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT],
          status: STATUS_CODES.CONFLICT,
          name: request.intent,
          cause: new Error(`Request context is not defined for request ${request.intent}`),
        }),
      )

    try {
      const alreadyProcessed = await this._idempotencyStore.hasBeenProcessed(
        context.network.requestId,
      )
      if (alreadyProcessed) {
        const payload = await this._idempotencyStore.getPayload<TResult>(context.network.requestId)
        if (Guards.isDefined(payload)) {
          return Result.ok(payload)
        } else {
          return Result.fail(
            AppError.create({
              code: PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT,
              message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT],
              status: STATUS_CODES.CONFLICT,
              name: request.intent,
              cause: new Error(
                `Idempotency store indicates request has been processed but no payload found for request ID ${context.network.requestId}`,
              ),
            }),
          )
        }
      }

      const lockAcquired = await this._idempotencyStore.acquireLock(
        context.network.requestId,
        this._lockTtlSeconds,
      )

      if (!lockAcquired) {
        return Result.fail(
          AppError.create({
            code: PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT,
            message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT],
            status: STATUS_CODES.CONFLICT,
            name: request.intent,
            cause: new Error(`Failed to acquire lock for request ID ${context.network.requestId}`),
          }),
        )
      }

      const result = await next()

      if (result.isOk()) {
        await this._idempotencyStore.markAsProcessed(
          context.network.requestId,
          result.getValueOrThrow(),
          this._processedTtlSeconds,
        )
      } else {
        await this._idempotencyStore.releaseLock(context.network.requestId)
      }

      return result
    } catch (error: unknown) {
      await this._idempotencyStore.releaseLock(context.network.requestId)

      throw error
    }
  }
}
