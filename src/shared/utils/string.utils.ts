import type { Dictionary, Optional } from '@/shared'
import { Guards } from '@/shared'

/**
 * @description Namespace for string manipulation utilities.
 */
export const StringHelper = Object.freeze({
  /**
   * @description Safely converts a value to a JSON string, falling back to String() on failure.
   * @param value The value to stringify.
   * @returns A JSON string representation of the value, or a fallback string if serialization fails.
   */
  safeStringify(value: unknown): string {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  },

  /**
   * @description Safely parses a JSON string, returning a fallback value on failure.
   * @param input The JSON string to parse.
   * @param fallback Optional fallback value to return if parsing fails.
   * @returns The parsed value, or the fallback value if parsing fails.
   */
  safeParse<T = unknown>(input: string, fallback: Optional<T> = undefined): T | Optional<string> {
    try {
      return JSON.parse(input) as T
    } catch {
      return fallback ?? input
    }
  },

  /**
   * @description Converts a string to camelCase.
   * @param input Input string (supports snake_case, kebab-case, or space-separated).
   * @returns camelCase string.
   */
  camelCase(input: string): string {
    const segments = input.split(/[-_\s]+/)
    const [first, ...rest] = segments
    const head = Guards.isDefined(first) ? first.toLowerCase() : ''
    return head + rest.map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1)).join('')
  },

  /**
   * @description Interpolates {{key}} placeholders in a template string.
   * @param template Template string with {{key}} tokens.
   * @param vars Key-value substitution map.
   * @returns Interpolated string with resolved placeholders.
   */
  interpolate(template: string, vars: Readonly<Dictionary<string | number>>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      const value = vars[key]
      return Guards.isDefined(value) ? String(value) : `{{${key}}}`
    })
  },

  /**
   * @description Truncates a string to maxLength, appending a suffix when truncated.
   * @param input Input string.
   * @param maxLength Maximum character length including the suffix.
   * @param suffix Appended suffix on truncation.
   * @returns Truncated string.
   */
  truncate(input: string, maxLength: number, suffix = '…'): string {
    if (input.length <= maxLength) return input
    const cutAt = Math.max(0, maxLength - suffix.length)
    return input.slice(0, cutAt) + suffix
  },

  /**
   * @description Generates a reference code with a prefix, random alphanumeric part, and year.
   * @param prefix Custom prefix for the reference code (e.g., "TRV" for travel).
   * @returns Formatted reference code string.
   */
  generateReferenceCode(prefix: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomPart = ''
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const year = new Date().getFullYear()
    return `${prefix}-${randomPart}-${year}` // Es: TRV-XJ82L9-2026
  },
} as const)
