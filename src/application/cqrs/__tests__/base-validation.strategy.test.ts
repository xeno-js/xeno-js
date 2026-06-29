import { describe, expect, it } from 'vitest'

import type { IRequest } from '@/domain'
import { Result } from '@/domain'
import { PIPELINE_ERROR_CODES, STATUS_CODES } from '@/shared'

import { BaseValidationStrategy } from '../pipelines/pipeline_strategies/validation/base-validation.strategy'

class TestValidationStrategy extends BaseValidationStrategy {
  public async execute(_request: IRequest) {
    return Result.ok(true)
  }

  public testCreateValidationError(request: IRequest, message: string) {
    return this.createValidationError(request, message)
  }
}

describe('BaseValidationStrategy', () => {
  const strategy = new TestValidationStrategy()

  it('should create a failure result with correct validation error properties', async () => {
    const request: IRequest = { intent: 'TestIntent', type: 'COMMAND', signal: undefined }
    const errorMessage = 'errors.pipelines.validation_error'

    const result = strategy.testCreateValidationError(request, errorMessage)

    expect(result.isOk()).toBe(false)

    const appError = result.getErrorOrThrow()

    expect(appError.code).toBe(PIPELINE_ERROR_CODES.VALIDATION_ERROR)
    expect(appError.status).toBe(STATUS_CODES.BAD_REQUEST)
    expect(appError.name).toBe('TestIntent')

    expect(appError.cause).toBeInstanceOf(Error)
    expect(appError.message).toBe(errorMessage)
  })
})
