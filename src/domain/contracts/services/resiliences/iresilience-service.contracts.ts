import type { Optional } from '@/shared'

/**
 * @description The ServiceResilience interface defines a contract for implementing resilience features in service calls. It provides a method to execute asynchronous operations with built-in support for retries, timeouts, and circuit breakers. This interface is designed to enhance the reliability of service interactions by automatically handling transient faults and preventing cascading failures in distributed systems.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IServiceResilience {
  /**
   * @description Executes a given asynchronous operation with resilience features such as retries, timeouts, and circuit breakers. This method is designed to handle transient faults and improve the reliability of service calls by automatically retrying failed operations, enforcing timeouts to prevent hanging requests, and implementing circuit breaker patterns to avoid overwhelming services that are experiencing issues. The method takes an asynchronous function as input and returns a Promise that resolves with the result of the operation or rejects with an error if the operation fails after exhausting all retry attempts or if a timeout occurs.
   * @param action An asynchronous function that represents the operation to be executed with resilience features. This function should return a Promise that resolves with the result of the operation or rejects with an error if the operation fails.
   * @param signal An optional AbortSignal that can be used to cancel the operation.
   * @returns A Promise that resolves with the result of the operation if it succeeds within the allowed retry attempts and timeouts, or rejects with an error if it fails after exhausting all retry attempts or if a timeout occurs.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  execute<T>(action: () => Promise<T>, signal: Optional<AbortSignal>): Promise<T>
}
