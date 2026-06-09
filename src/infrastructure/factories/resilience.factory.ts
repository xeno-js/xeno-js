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
import { ServiceResilience } from '@/infrastructure'
import {
  Guards,
  type Optional,
  RESILIENCE_DEFAULTS,
  type ResilienceConfig,
  STATUS_CODES,
} from '@/shared'

/**
 * @description Factory class responsible for creating instances of ServiceResilience based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the ServiceResilience, including the initialization of the underlying resilience policies with the specified configuration options such as retry, circuit breaker, and bulkhead. This design promotes separation of concerns and allows for flexibility in managing ServiceResilience instances across the application.
 */
export class ServiceResilienceFactory implements IFactory<ResilienceConfig, IServiceResilience> {
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

    const status = 'status' in error ? (error as { status?: number }).status : undefined

    return status === STATUS_CODES.INTERNAL_SERVER_ERROR
  }

  private checkConfigValue(value: Optional<number>, defaultValue: number, message: string): number {
    if (Guards.isDefined(value)) {
      Guards.throwIfNegative(value, message)
      return value
    }
    return defaultValue
  }
}
