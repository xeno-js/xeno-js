import type { InjectionToken } from '@/shared'

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
   */
  createToken<T>(description: string): InjectionToken<T> {
    return { symbol: Symbol(description) } as unknown as InjectionToken<T>
  },
} as const)
