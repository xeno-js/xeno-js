/**
 * @description This module defines constants related to concurrency handling in the application, specifically for the ConcurrencyRetryPipeline. These constants include the maximum number of retry attempts, the base delay for retries, and the maximum jitter to be added to the delay. The constants are exported as a frozen object to prevent modification at runtime, ensuring consistent behavior across the application when handling concurrency conflicts.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const DEFAULT_CONCURRENCY = Object.freeze({
  /**
   * @description Number of maximum retry attempts for handling concurrency conflicts in the pipeline. If the number of attempts exceeds this value, the pipeline will return a failed Result with an AppError indicating that the maximum retry attempts have been exceeded due to concurrency conflicts.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  MAX_RETRIES: 3,
  /**
   * @description Base delay in milliseconds for retrying a request after a concurrency conflict is detected. The actual delay will be calculated using an exponential backoff strategy with added jitter to prevent thundering herd problems when multiple requests are retried simultaneously.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  BASE_DELAY: 20,
  /**
   * @description Maximum jitter in milliseconds to be added to the base delay when retrying a request after a concurrency conflict is detected. This helps to randomize the retry attempts and reduce the likelihood of multiple requests being retried at the same time, which can lead to further conflicts. The actual delay for each retry will be calculated as baseDelayMs * (2 ** attempt) + randomJitter, where randomJitter is a random value between 0 and maxJitterMs.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  MAX_JITTER: 30,
} as const)
