import type { IFactory, IServiceResilience, Optional } from '@xeno-js/shared'
import { AppError, Guards, RESILIENCE_DEFAULTS } from '@xeno-js/shared'
import {
  bulkhead,
  circuitBreaker,
  ConsecutiveBreaker,
  ExponentialBackoff,
  handleWhen,
  retry,
  wrap,
} from 'cockatiel'

import type { ResilienceConfig } from '@/domain'

import { ServiceResilience } from '../services/resiliences/resilience.service'

interface HttpErrorLike {
  code?: string
  status?: number
  config?: {
    method?: string
  }
}

/**
 * @description Factory class responsible for creating instances of ServiceResilience based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the ServiceResilience, including the initialization of the underlying resilience policies with the specified configuration options such as retry, circuit breaker, and bulkhead. This design promotes separation of concerns and allows for flexibility in managing ServiceResilience instances across the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
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
      handleWhen((error: unknown) => this.isTransientAndIdempotent(error)),
      {
        maxAttempts: normalizedConfig.retry.attempts,
        backoff: new ExponentialBackoff({
          initialDelay: normalizedConfig.retry.baseDelayMs,
          maxDelay: normalizedConfig.retry.maxDelayMs,
        }),
      },
    )

    const circuitBreakerPolicy = circuitBreaker(
      handleWhen((error: unknown) => this.isTransientError(error)),
      {
        breaker: new ConsecutiveBreaker(normalizedConfig.circuitBreaker.consecutiveFailures),
        halfOpenAfter: normalizedConfig.circuitBreaker.halfOpenTimeoutMs,
      },
    )

    const bulkheadPolicy = bulkhead(normalizedConfig.bulkhead.maxConcurrent)

    return new ServiceResilience(wrap(bulkheadPolicy, circuitBreakerPolicy, retryPolicy))
  }

  private isTransientError(error: unknown): boolean {
    if (!Guards.isDefined(error) || !Guards.isObject(error)) return false

    let status: number | undefined
    let isNetworkError = false

    if (error instanceof AppError) {
      status = error.status
      const cause = error.cause as HttpErrorLike
      if (Guards.isDefined(cause) && Guards.isString(cause.code)) {
        isNetworkError = [
          'ECONNABORTED',
          'ECONNRESET',
          'ETIMEDOUT',
          'ENOTFOUND',
          'ECONNREFUSED',
        ].includes(cause.code.toUpperCase())
      }
    } else {
      const err = error as HttpErrorLike
      status = err.status
      if (Guards.isString(err.code)) {
        isNetworkError = [
          'ECONNABORTED',
          'ECONNRESET',
          'ETIMEDOUT',
          'ENOTFOUND',
          'ECONNREFUSED',
        ].includes(err.code.toUpperCase())
      }
    }

    if (isNetworkError) return true

    if (Guards.isDefined(status)) {
      // 408 Request Timeout, 429 Too Many Requests, and Server Errors (5xx)
      return status === 408 || status === 429 || (status >= 500 && status < 600)
    }

    return false
  }

  private isTransientAndIdempotent(error: unknown): boolean {
    if (!this.isTransientError(error)) return false

    let method: string | undefined

    if (error instanceof AppError) {
      const cause = error.cause as HttpErrorLike
      if (
        Guards.isDefined(cause) &&
        Guards.isDefined(cause.config) &&
        Guards.isString(cause.config.method)
      ) {
        method = cause.config.method.toUpperCase()
      }
    } else {
      const err = error as HttpErrorLike
      if (Guards.isDefined(err.config) && Guards.isString(err.config.method)) {
        method = err.config.method.toUpperCase()
      }
    }

    if (Guards.isNullOrEmpty(method)) return false

    const idempotentMethods = ['GET', 'PUT', 'DELETE', 'HEAD', 'OPTIONS']
    return idempotentMethods.includes(method)
  }

  private checkConfigValue(value: Optional<number>, defaultValue: number, message: string): number {
    if (Guards.isDefined(value)) {
      Guards.throwIfNegative(value, message)
      return value
    }
    return defaultValue
  }
}
