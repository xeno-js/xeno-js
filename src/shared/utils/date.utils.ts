import { Guards } from './guards.utils'

const MS_PER_DAY = 86_400_000

/**
 * @description Namespace for timezone-agnostic date utilities.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export const DateHelper = Object.freeze({
  /**
   * @description Converts a Date to an ISO 8601 string.
   * @param date Input date.
   * @returns ISO 8601 UTC string.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  toISOString(date: Date): string {
    return date.toISOString()
  },

  /**
   * @description Returns a new Date with the given number of days added.
   * @param date Base date.
   * @param days Number of days to add (negative values subtract).
   * @returns New Date instance.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * MS_PER_DAY)
  },

  /**
   * @description Checks whether a date has elapsed relative to a reference time.
   * @param expiresAt Expiry date.
   * @param nowMs Reference epoch in milliseconds (defaults to Date.now()).
   * @returns True when expiresAt is in the past.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  isExpired(expiresAt: Date, nowMs?: number): boolean {
    const now = nowMs ?? Date.now()
    return expiresAt.getTime() < now
  },

  /**
   * @description Checks if one date is after another.
   * @param after Date to check if it is after.
   * @param before Date to check against.
   * @returns True when after is after before.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  isAfter(after: Date, before: Date): boolean {
    return Guards.isDate(after) && Guards.isDate(before) && after.getTime() > before.getTime()
  },

  /**
   * @description Checks if a date is in the future relative to now.
   * @param date Date to check.
   * @returns True when date is in the future.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  isFuture(date: Date): boolean {
    return Guards.isDate(date) && date.getTime() > Date.now()
  },
} as const)
