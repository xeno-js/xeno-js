import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { AppError } from '@/domain'
import { PIPELINE_ERROR_CODES, PIPELINE_ERROR_CODES_KEYS, STATUS_CODES } from '@/shared'

import { ZodValidatorService } from '../zod.validator'

describe('ZodValidatorService', () => {
  describe('hasSchema', () => {
    it('returns true when key exists in registry', () => {
      const registry = new Map([['user', z.object({ name: z.string() })]])
      const service = new ZodValidatorService(registry)

      expect(service.hasSchema('user')).toBe(true)
    })

    it('returns false when key does not exist in registry', () => {
      const service = new ZodValidatorService(new Map())

      expect(service.hasSchema('missing')).toBe(false)
    })
  })

  describe('validate', () => {
    it('returns Result.ok(true) when data is valid for schema', () => {
      const schema = z.object({ name: z.string().min(3) })
      const service = new ZodValidatorService(new Map([['user', schema]]))

      const result = service.validate('user', { name: 'Alice' })

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toBe(true)
    })

    it('returns UNEXPECTED_ERROR when schema key is missing', () => {
      const service = new ZodValidatorService<unknown>(new Map())
      const result = service.validate('missing', { any: 'value' })

      expect(result.isOk()).toBe(false)

      const error = result.getErrorOrThrow()
      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe(PIPELINE_ERROR_CODES.UNEXPECTED_ERROR)
      expect(error.message).toBe(PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.UNEXPECTED_ERROR])
      expect(error.status).toBe(STATUS_CODES.INTERNAL_SERVER_ERROR)
      expect(error.name).toBe('missing')
      expect(error.cause).toBeInstanceOf(Error)
      if (error.cause instanceof Error) {
        expect(error.cause.message).toContain(
          'Schema with key "missing" does not exist in the registry.',
        )
      }
    })

    it('returns VALIDATION_ERROR and formats both path and root issues', () => {
      const schema = z
        .object({
          name: z.string().min(3),
        })
        .superRefine((_value, ctx) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [],
            message: 'root issue',
          })
        })

      const service = new ZodValidatorService(new Map([['user', schema]]))
      const result = service.validate('user', { name: 'a' })

      expect(result.isOk()).toBe(false)

      const error = result.getErrorOrThrow()
      expect(error.code).toBe(PIPELINE_ERROR_CODES.VALIDATION_ERROR)
      expect(error.message).toBe(PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.VALIDATION_ERROR])
      expect(error.status).toBe(STATUS_CODES.BAD_REQUEST)
      expect(error.name).toBe('user')
      expect(error.cause).toBeInstanceOf(Error)

      if (error.cause instanceof Error) {
        expect(error.cause.message).toContain('Validation failed for schema with key "user":')
        expect(error.cause.message).toContain('[name]')
        expect(error.cause.message).toContain('[root] root issue')
        expect(error.cause.message).toContain(', ')
      }
    })
  })
})
