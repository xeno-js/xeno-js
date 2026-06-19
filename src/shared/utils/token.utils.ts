import type { InjectionToken } from '../types/index'

/**
 * @fileoverview Utility for creating and managing typed injection tokens.
 * This module defines the `TokenHelper` factory for generating unique, type-safe tokens
 * that can be used for dependency injection in the application.
 * The `createToken` method produces an `InjectionToken<T>` which binds a runtime `symbol`
 * to a compile-time type `T` via a phantom property, ensuring type safety and preventing
 * accidental cross-token resolution.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export const TokenHelper = Object.freeze({
  /**
   * @description Factory that produces a uniquely branded {@link InjectionToken} for type `T`.
   *
   * This is the **only** sanctioned way to create injection tokens.
   * The phantom key `[_phantom]` is not accessible outside this module,
   * so no external code can accidentally forge a token for the wrong type.
   *
   * @param description - Human-readable label used as the `Symbol` description
   *   for debugging and logging.
   * @returns A new {@link InjectionToken} typed as `T`.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  createToken<T>(description: string): InjectionToken<T> {
    return { symbol: Symbol(description) } as unknown as InjectionToken<T>
  },
} as const)
