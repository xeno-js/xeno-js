import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { AppError } from '@/domain'
import { PIPELINE_ERROR_CODES, PIPELINE_ERROR_CODES_KEYS, STATUS_CODES } from '@/shared'

import { ZodValidatorService } from '../zod.validator'

describe('ZodValidatorService', () => {
  describe('addSchema', () => {
    it('adds a schema to the registry and allows subsequent validation', async () => {
      const service = new ZodValidatorService()
      service.addSchema('user', z.object({ name: z.string() }))

      const result = await service.validate('user', { name: 'Alice' })

      expect(result.isOk()).toBe(true)
    })
  })

  describe('validate', () => {
    it('returns Result.ok(true) when data is valid for schema', async () => {
      const schema = z.object({ name: z.string().min(3) })
      const service = new ZodValidatorService(new Map([['user', schema]]))

      const result = await service.validate('user', { name: 'Alice' })

      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toBe(true)
    })

    it('returns VALIDATION_ERROR when schema key is missing', async () => {
      const service = new ZodValidatorService(new Map())
      const result = await service.validate('missing', { any: 'value' })

      expect(result.isOk()).toBe(false)

      const error = result.getErrorOrThrow()
      expect(error).toBeInstanceOf(AppError)
      expect(error.code).toBe(PIPELINE_ERROR_CODES.VALIDATION_ERROR)
      expect(error.message).toBe(PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.VALIDATION_ERROR])
      expect(error.status).toBe(STATUS_CODES.BAD_REQUEST)
      expect(error.name).toBe('ZodValidatorService')
      expect(error.cause).toBeInstanceOf(Error)
      if (error.cause instanceof Error) {
        expect(error.cause.message).toContain('Validation schema not found for key: missing')
      }
    })

    it('returns VALIDATION_ERROR and formats both path and root issues', async () => {
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
      const result = await service.validate('user', { name: 'a' })

      expect(result.isOk()).toBe(false)

      const error = result.getErrorOrThrow()
      expect(error.code).toBe(PIPELINE_ERROR_CODES.VALIDATION_ERROR)
      expect(error.message).toBe(PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.VALIDATION_ERROR])
      expect(error.status).toBe(STATUS_CODES.BAD_REQUEST)
      expect(error.name).toBe('ZodValidatorService')
      expect(error.cause).toBeInstanceOf(Error)

      if (error.cause instanceof Error) {
        expect(error.cause.message).toContain('Validation failed for schema:')
        expect(error.cause.message).toContain('[name]')
        expect(error.cause.message).toContain('[root] root issue')
        expect(error.cause.message).toContain(', ')
      }
    })
  })
})
