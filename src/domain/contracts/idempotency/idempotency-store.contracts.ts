import type { Optional } from '@/shared'

/**
 * @description Interface for an idempotency store that provides methods for acquiring locks, checking if a command has been processed, marking commands as processed with associated payloads, retrieving stored payloads, and releasing locks. This interface is designed to support idempotent command processing in a distributed system, ensuring that duplicate commands are not processed multiple times and that the results of previously processed commands can be retrieved when necessary.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IIdempotencyStore {
  /** @description Acquires a lock for the given commandId with a specified time-to-live (TTL) in seconds. This method is used to ensure that only one instance of a command with the same commandId is processed at a time, preventing duplicate processing of the same command. If the lock is successfully acquired, it returns true; otherwise, it returns false, indicating that another instance of the command is currently being processed.
   * @param commandId The unique identifier for the command for which the lock is being acquired. This ID is used to identify and manage locks for specific commands in the idempotency store.
   * @param ttlSeconds The time-to-live (TTL) in seconds for the lock being acquired. This parameter specifies how long the lock should be held before it expires, allowing for automatic release of locks in case of failures or timeouts during command processing.
   * @returns A promise that resolves to true if the lock was successfully acquired, or false if the lock is currently held by another instance of the command.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  acquireLock(commandId: string, ttlSeconds: number): Promise<boolean>

  /** @description Checks if a command with the given commandId has already been processed. This method is used to determine if a command has been previously executed and its result stored in the idempotency store. If the command has been processed, it returns true; otherwise, it returns false, indicating that the command has not been processed yet and can be safely executed.
   * @param commandId The unique identifier for the command to check for processing status. This ID is used to query the idempotency store to determine if a command with the specified ID has already been processed.
   * @returns A promise that resolves to true if the command has already been processed, or false if it has not been processed yet.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  hasBeenProcessed(commandId: string): Promise<boolean>

  /** @description Marks a command with the given commandId as processed and stores the associated payload in the idempotency store with a specified time-to-live (TTL) in seconds. This method is used to record the result of processing a command, allowing subsequent attempts to process the same commandId to recognize that it has already been handled and return the stored payload instead of executing the command again. The TTL parameter ensures that the stored result will expire after a certain period, allowing for eventual cleanup of old entries in the idempotency store.
   * @param commandId The unique identifier for the command being marked as processed. This ID is used to store the processing status and associated payload in the idempotency store for future reference.
   * @param payload The result or output associated with the processed command that should be stored in the idempotency store. This payload can be retrieved later when checking if the command has already been processed, allowing clients to obtain the result without re-executing the command.
   * @param ttlSeconds The time-to-live (TTL) in seconds for the stored payload. This parameter specifies how long the payload should remain in the idempotency store before it expires, ensuring that old entries are eventually cleaned up and do not consume storage indefinitely.
   * @returns A promise that resolves when the command has been marked as processed and the payload has been stored successfully in the idempotency store.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  markAsProcessed<T>(commandId: string, payload: T, ttlSeconds: number): Promise<void>

  /** @description Retrieves the payload associated with a processed command identified by the given commandId. This method is used to fetch the result of a previously processed command from the idempotency store, allowing clients to obtain the outcome of the command execution without having to reprocess the command. If a payload is found for the specified commandId, it returns the payload; otherwise, it returns null, indicating that there is no stored result for that commandId, which may occur if the command has not been processed or if the stored result has expired due to TTL.
   * @param commandId The unique identifier for the command whose associated payload is being retrieved. This ID is used to query the idempotency store for the stored result of the command execution.
   * @returns A promise that resolves to the payload associated with the processed command if it exists, or null if there is no stored result for the specified commandId.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  getPayload<T>(commandId: string): Promise<Optional<T>>

  /** @description Releases the lock associated with the given commandId, allowing other instances of the command to be processed. This method is used to free up the lock after a command has been processed, ensuring that subsequent attempts to process the same commandId can acquire the lock and execute the command if necessary. Releasing the lock is important for preventing deadlocks and ensuring that the idempotency mechanism functions correctly by allowing new commands with the same commandId to be processed after the previous one has completed.
   * @param commandId The unique identifier for the command whose lock is being released. This ID is used to identify the lock in the idempotency store and free it for subsequent command processing.
   * @returns A promise that resolves when the lock has been successfully released.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  releaseLock(commandId: string): Promise<void>
}
