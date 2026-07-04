import type { Optional } from '../types'
import { Guards } from './guards.utils'

/**
 * @description Namespace for safe mathematical operations.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const MathHelper = Object.freeze({
  /**
   * @description Constrains a value within an inclusive min-max range.
   * @param value Input value.
   * @param min Minimum bound.
   * @param max Maximum bound.
   * @returns Clamped value.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  toPercentage(part: number, total: number): number {
    if (total === 0) return 0
    return (part / total) * 100
  },
  /**
   * @description Converts a value to a number, returning a fallback for non-numeric inputs.
   * @param value Input value.
   * @param fallback Fallback value for non-numeric inputs.
   * @returns Numeric value or fallback.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  toNumber(value: Optional<unknown>, fallback = 0): number {
    if (!Guards.isDefined(value) || !Guards.isNumber(value)) return fallback
    const num = Number(value)
    return isNaN(num) ? fallback : num
  },
} as const)
