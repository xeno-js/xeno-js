import { z } from 'zod'

import { REQUEST_TYPE } from '@/shared'

/**
 * @description Base schema for any Request
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export const baseRequestZodSchema = z.object({
  intent: z.string().min(1, 'Intent is required'),
  type: z.literal(REQUEST_TYPE.COMMAND),
})

/**
 * @description Base schema for any Command
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export const baseCommandZodSchema = baseRequestZodSchema.extend({})

const cacheableOptionsZodSchema = z.object({
  cacheKey: z.string().min(1, 'Cache key is required'),
  ttl: z.number().int().positive().optional(),
  bypassCache: z.boolean().optional(),
  consistentRead: z.boolean().optional(),
})

/**
 * @description Base schema for any Query
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export const baseQueryZodSchema = baseRequestZodSchema.extend({
  cacheOptions: cacheableOptionsZodSchema,
})
