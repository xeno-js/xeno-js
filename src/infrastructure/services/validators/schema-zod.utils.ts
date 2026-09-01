import type { z } from 'zod'

import { baseCommandZodSchema, baseQueryZodSchema } from './base-schema.constant'

/**
 * @description Utility functions for creating Zod schemas for commands and queries.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export const ZodUtils = Object.freeze({
  /**
   * @description Creates a Zod schema for a command by extending the base command schema with additional properties.
   * @param additionalSchema - An object representing additional properties to be added to the command schema.
   * @returns A Zod schema for the command.
   */
  createCommandSchema: (additionalSchema: z.ZodRawShape) => {
    return baseCommandZodSchema.extend(additionalSchema)
  },
  /**
   * @description Creates a Zod schema for a query by extending the base query schema with additional properties.
   * @param additionalSchema - An object representing additional properties to be added to the query schema.
   * @returns A Zod schema for the query.
   */
  createQuerySchema: (additionalSchema: z.ZodRawShape) => {
    return baseQueryZodSchema.extend(additionalSchema)
  },
})
