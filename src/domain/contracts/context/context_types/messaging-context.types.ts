import type { Optional } from '@/shared'

/**
 * @description MessagingContext defines the structure for messaging-related information used in message handling and processing. It includes properties such as return address, expiration time, and message sequence information, which can be used for managing message delivery, expiration, and sequencing in distributed systems.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface MessageSequence {
  /** @description The unique identifier for the message sequence, which can be used to track and manage the order of messages in a sequence.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly sequenceId: Optional<string>
  /** @description The position of the message within the sequence, which can be used to determine the order of messages in a sequence.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly position: Optional<number>
  /** @description The total number of messages in the sequence, which can be used to determine the size of the sequence.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly size: Optional<number>
}

/**
 * @description MessagingContext defines the structure for messaging-related information used in message handling and processing. It includes properties such as return address, expiration time, and message sequence information, which can be used for managing message delivery, expiration, and sequencing in distributed systems.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface MessagingContext {
  /** @description The return address for asynchronous responses, which can be used to specify where to send responses for asynchronous message processing.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly returnAddress: Optional<string>
  /** @description The expiration time for the message, which can be used to determine when the message should be considered expired and no longer processed.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly expiration: Optional<number>
  /** @description The sequence information for the message, which can be used to manage the order and grouping of messages in a sequence.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly sequence: Optional<MessageSequence>
}
