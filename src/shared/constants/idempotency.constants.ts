/**
 * @description Constants used in the idempotency store implementation, including key prefixes for locks and processed commands, default time-to-live (TTL) values, and standard values for indicating locked and processed states. These constants are defined as a frozen object to ensure immutability and provide a centralized location for managing configuration values related to idempotency handling in the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const IDEMPOTENCY_CONSTANTS = Object.freeze({
  /**
   * @description Prefix for keys used to store locks in the idempotency store. This prefix is used to differentiate lock entries from other types of entries in the cache, allowing for efficient management of locks when acquiring and releasing them during command processing. The lock key prefix helps ensure that lock-related data is organized and easily identifiable within the caching mechanism.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  LOCK_KEY_PREFIX: 'idempotency_lock:',

  /**
   * @description Prefix for keys used to store processed command results in the idempotency store. This prefix is used to differentiate processed command entries from lock entries and other types of data in the cache, allowing for efficient retrieval of stored results when checking if a command has already been processed. The processed key prefix helps maintain a clear structure within the caching mechanism, making it easier to manage and query processed command data.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  PROCESSED_KEY_PREFIX: 'idempotency_processed:',

  /**
   * @description Default time-to-live (TTL) in seconds for locks and processed command entries in the idempotency store. This value is used when acquiring locks and marking commands as processed to specify how long the lock or stored result should remain valid before it expires. The default TTL helps ensure that locks and processed command entries do not persist indefinitely, allowing for automatic cleanup of stale data and preventing potential issues with long-lived locks or outdated results in the idempotency store.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  DEFAULT_TTL_SECONDS: 86400,

  /**
   * @description Default time-to-live (TTL) in seconds for locks in the idempotency store. This value is used when acquiring locks to specify how long the lock should remain valid before it expires. The default lock TTL helps ensure that locks do not persist indefinitely, allowing for automatic cleanup of stale locks and preventing potential issues with long-lived locks in the idempotency mechanism.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  DEFAULT_IDEMPOTENCY_LOCK_TTL_SECONDS: 60,

  /**
   * @description Standard value used to indicate that a lock has been acquired for a specific commandId in the idempotency store. This value is stored in the cache when a lock is successfully acquired, allowing other instances of the command to recognize that the command is currently being processed and prevent duplicate processing. The locked value serves as a marker for active locks in the idempotency mechanism, helping to manage concurrent command processing effectively.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  LOCKED_VALUE: 'LOCKED',

  /**
   * @description Standard value used to indicate that a command has been processed and its result has been stored in the idempotency store. This value is stored in the cache when a command is marked as processed, allowing subsequent attempts to process the same commandId to recognize that it has already been handled and return the stored result instead of executing the command again. The processed value serves as a marker for completed commands in the idempotency mechanism, helping to manage command processing outcomes and prevent redundant executions.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  PROCESSED_VALUE: 'PROCESSED',
} as const)
