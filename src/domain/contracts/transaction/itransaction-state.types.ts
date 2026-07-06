import type { Maybe } from '@/shared'

/**
 * @file itransaction-state.types.ts
 * @description This file contains the definition of the ITransactionState interface.
 * @version 1.0.0
 * @author Xeno
 * @since 2025-09-30
 * @link
 */

/**
 * @interface ITransactionState
 * @template TTx - The type of the transaction state.
 * @description Represents the state of a transaction, which can be either a specific transaction type or null.
 *
 * @property {Maybe<TTx>} state - The current state of the transaction.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link
 */
export interface ITransactionState<TTx = unknown> {
  /**
   * Gets the current state of the transaction, which can be either a specific transaction type or null.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  get state(): Maybe<TTx>

  /**
   * Sets the current state of the transaction, which can be either a specific transaction type or null.
   *
   * @param value - The new state of the transaction.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  set state(value: Maybe<TTx>)
}
