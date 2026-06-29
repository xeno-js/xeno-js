import type { InjectionToken } from '../types/index'

const tokenRegistry = new Map<string, InjectionToken<unknown>>()

/**
 * @fileoverview Utility for creating and managing typed injection tokens.
 * This module defines the `TokenHelper` factory for generating unique, type-safe tokens
 * that can be used for dependency injection in the application.
 * The `createToken` method produces an `InjectionToken<T>` which binds a runtime `symbol`
 * to a compile-time type `T` via a phantom property, ensuring type safety and preventing
 * accidental cross-token resolution.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
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
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  createToken<T>(description: string): InjectionToken<T> {
    if (tokenRegistry.has(description)) {
      return tokenRegistry.get(description) as InjectionToken<T>
    }

    const token = { symbol: Symbol(description) } as unknown as InjectionToken<T>
    tokenRegistry.set(description, token)
    return token
  },
  /**
   * @description Retrieves an existing {@link InjectionToken} by its description.
   *
   * @param description - The human-readable label used when the token was created.
   * @returns The corresponding {@link InjectionToken} if found, otherwise `undefined`.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  get<T>(description: string): InjectionToken<T> | undefined {
    return tokenRegistry.get(description) as InjectionToken<T> | undefined
  },
} as const)
