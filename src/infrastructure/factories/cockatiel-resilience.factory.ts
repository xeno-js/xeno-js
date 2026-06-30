import {
  bulkhead,
  circuitBreaker,
  ConsecutiveBreaker,
  ExponentialBackoff,
  handleAll,
  handleWhen,
  retry,
  wrap,
} from 'cockatiel'

import type { IFactory, IServiceResilience } from '@/domain'
import { AppError } from '@/domain'
import type { Optional } from '@/shared'
import { Guards, RESILIENCE_DEFAULTS, STATUS_CODES } from '@/shared'

import type { ResilienceConfig } from '../modules/config/resilience.config'
import { ServiceResilience } from '../services/resiliences/resilience.service'

/**
 * @description Factory class responsible for creating instances of ServiceResilience based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the ServiceResilience, including the initialization of the underlying resilience policies with the specified configuration options such as retry, circuit breaker, and bulkhead. This design promotes separation of concerns and allows for flexibility in managing ServiceResilience instances across the application.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export class CockatielResilienceFactory implements IFactory<ResilienceConfig, IServiceResilience> {
  public create(config: ResilienceConfig): IServiceResilience {
    const message =
      'The resilience configuration provided is invalid. Please ensure that all values are non-negative numbers.'
    const normalizedConfig = {
      retry: {
        attempts: this.checkConfigValue(
          config.retry.attempts,
          RESILIENCE_DEFAULTS.RETRY.ATTEMPTS,
          message,
        ),
        baseDelayMs: this.checkConfigValue(
          config.retry.baseDelayMs,
          RESILIENCE_DEFAULTS.RETRY.BASE_DELAY_MS,
          message,
        ),
        maxDelayMs: this.checkConfigValue(
          config.retry.maxDelayMs,
          RESILIENCE_DEFAULTS.RETRY.MAX_DELAY_MS,
          message,
        ),
      },
      circuitBreaker: {
        consecutiveFailures: this.checkConfigValue(
          config.circuitBreaker.consecutiveFailures,
          RESILIENCE_DEFAULTS.CIRCUIT_BREAKER.CONSECUTIVE_FAILURES,
          message,
        ),
        halfOpenTimeoutMs: this.checkConfigValue(
          config.circuitBreaker.halfOpenTimeoutMs,
          RESILIENCE_DEFAULTS.CIRCUIT_BREAKER.HALF_OPEN_TIMEOUT_MS,
          message,
        ),
      },
      bulkhead: {
        maxConcurrent: this.checkConfigValue(
          config.bulkhead.maxConcurrent,
          RESILIENCE_DEFAULTS.BULKHEAD.MAX_CONCURRENT,
          message,
        ),
      },
    }

    const retryPolicy = retry(
      handleWhen((error: unknown) => this.isRetryableServerError(error)),
      {
        maxAttempts: normalizedConfig.retry.attempts,
        backoff: new ExponentialBackoff({
          initialDelay: normalizedConfig.retry.baseDelayMs,
          maxDelay: normalizedConfig.retry.maxDelayMs,
        }),
      },
    )

    const circuitBreakerPolicy = circuitBreaker(handleAll, {
      breaker: new ConsecutiveBreaker(normalizedConfig.circuitBreaker.consecutiveFailures),
      halfOpenAfter: normalizedConfig.circuitBreaker.halfOpenTimeoutMs,
    })

    const bulkheadPolicy = bulkhead(normalizedConfig.bulkhead.maxConcurrent)

    return new ServiceResilience(wrap(bulkheadPolicy, circuitBreakerPolicy, retryPolicy))
  }

  private isRetryableServerError(error: unknown): boolean {
    if (!Guards.isDefined(error) || !Guards.isObject(error)) {
      return false
    }
    if (error instanceof AppError) {
      const status = error.status
      return (
        Guards.isDefined(status) && status >= STATUS_CODES.INTERNAL_SERVER_ERROR && status < 600
      )
    }
    if (error instanceof Error) {
      const status = 'status' in error ? (error as { status?: number }).status : undefined
      if (Guards.isDefined(status)) {
        return status >= STATUS_CODES.INTERNAL_SERVER_ERROR && status < 600
      }
      return true
    }

    return false
  }

  private checkConfigValue(value: Optional<number>, defaultValue: number, message: string): number {
    if (Guards.isDefined(value)) {
      Guards.throwIfNegative(value, message)
      return value
    }
    return defaultValue
  }
}
