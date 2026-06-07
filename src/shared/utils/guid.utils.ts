import type { Guid } from '@/shared'

/**
 * @fileoverview Utility functions for generating and validating GUIDs (UUID v4).
 * This module provides a simple interface for working with GUIDs, including generation and validation.
 */
export const GuidHelper = Object.freeze({
  /**
   * @description Generates a cryptographically-random UUID v4.
   * @returns Lowercase UUID v4 string.
   */
  generate(): Guid {
    return crypto.randomUUID()
  },

  /**
   * @description Validates if a string is a valid UUID v4.
   * @param value Candidate string to validate.
   * @returns True if the string is a valid UUID v4, false otherwise.
   */
  isValid(value: Guid): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(value)
  },

  isEmpty(value: Guid): boolean {
    const emptyGuid = '00000000-0000-0000-0000-000000000000'
    return value === emptyGuid
  },
} as const)
