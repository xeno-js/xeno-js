import type { Guid, Optional } from '../types/common.types'
import { Guards } from './guards.utils'

/**
 * @fileoverview Utility functions for generating and validating GUIDs (UUID v4).
 * This module provides a simple interface for working with GUIDs, including generation and validation.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const GuidHelper = Object.freeze({
  /**
   * @description Generates a cryptographically-random UUID v4.
   * @returns Lowercase UUID v4 string.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  generate(): Guid {
    return crypto.randomUUID()
  },

  /**
   * @description Validates if a value is a valid GUID (UUID v4) and not empty.
   * @param value The value to validate.
   * @returns True if the value is a valid and non-empty GUID, false otherwise.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isValidGuid(value: Guid): boolean {
    const guid = value.toString()
    return GuidHelper.isValid(guid) && !GuidHelper.isEmpty(guid)
  },

  /**
   * @description Validates if a string is a valid UUID v4.
   * @param value Candidate string to validate.
   * @returns True if the string is a valid UUID v4, false otherwise.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isValid(value: string): value is Guid {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(value)
  },

  /**
   * @description Converts a string to a GUID if it's valid.
   * @param value The string to convert.
   * @returns The GUID if the string is valid, otherwise undefined.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  parse(value: Optional<string>): Optional<Guid> {
    if (!Guards.isNullOrEmpty(value) && this.isValid(value) && !this.isEmpty(value)) {
      return value
    }
    return undefined
  },

  /**
   * @description Checks if a GUID is the empty GUID (all zeros).
   * @param value The GUID to check.
   * @returns True if the GUID is the empty GUID, false otherwise.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  isEmpty(value: string): boolean {
    const emptyGuid = '00000000-0000-0000-0000-000000000000'
    return value === emptyGuid
  },
} as const)
