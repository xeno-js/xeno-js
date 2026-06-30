/**
 * @description Namespace for safe mathematical operations.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export const MathHelper = Object.freeze({
  /**
   * @description Constrains a value within an inclusive min-max range.
   * @param value Input value.
   * @param min Minimum bound.
   * @param max Maximum bound.
   * @returns Clamped value.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  },

  /**
   * @description Rounds a number to the specified decimal precision.
   * @param value Input value.
   * @param decimals Number of decimal places.
   * @returns Rounded value.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  roundTo(value: number, decimals: number): number {
    const factor = 10 ** decimals
    return Math.round(value * factor) / factor
  },

  /**
   * @description Divides two numbers, returning a safe fallback on zero denominator.
   * @param numerator Numerator.
   * @param denominator Denominator.
   * @param fallback Return value when denominator is zero.
   * @returns Division result or fallback.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  safeDivide(numerator: number, denominator: number, fallback = 0): number {
    if (denominator === 0) return fallback
    return numerator / denominator
  },

  /**
   * @description Returns the percentage of part over total (0–100 scale).
   * @param part Part value.
   * @param total Total value.
   * @returns Percentage or 0 when total is zero.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  toPercentage(part: number, total: number): number {
    if (total === 0) return 0
    return (part / total) * 100
  },
} as const)
