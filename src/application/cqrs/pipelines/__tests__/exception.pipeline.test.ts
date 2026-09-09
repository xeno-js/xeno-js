import type { IRequest } from '@xeno-js/shared'
import { AppError, Result } from '@xeno-js/shared'
import { ERROR_CODES, STATUS_CODES } from '@xeno-js/shared'
import { describe, expect, it, vi } from 'vitest'

import { ExceptionPipeline } from '../exception.pipeline'

describe('ExceptionPipeline', () => {
  const pipeline = new ExceptionPipeline()
  const mockRequest: IRequest<{ id: string }> = {
    intent: 'TestIntent',
    type: 'COMMAND',
  }

  it('should return the result successfully when next() does not throw', async () => {
    const mockNext = vi.fn().mockResolvedValue(Result.ok('success'))

    const result = await pipeline.handle(mockRequest, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBe('success')
  })

  it('should catch AppError and return Result.fail with the same error', async () => {
    const expectedError = AppError.create({
      code: 'CUSTOM_ERROR',
      message: 'Custom error message',
      status: STATUS_CODES.BAD_REQUEST,
      name: 'TestIntent',
      cause: new Error('Cause of the error'),
    })

    const mockNext = vi.fn().mockRejectedValue(expectedError)

    const result = await pipeline.handle(mockRequest, mockNext)

    expect(result.isOk()).toBe(false)
    expect(result.getErrorOrThrow()).toBe(expectedError)
  })

  it('should catch generic errors and wrap them in SYSTEM_ERROR AppError', async () => {
    const genericError = new Error('Unexpected crash')
    const mockNext = vi.fn().mockRejectedValue(genericError)

    const result = await pipeline.handle(mockRequest, mockNext)

    expect(result.isOk()).toBe(false)
    const error = result.getErrorOrThrow()

    expect(error).toBeInstanceOf(AppError)
    expect(error?.code).toBe(ERROR_CODES.SYSTEM_ERROR)
    expect(error?.status).toBe(STATUS_CODES.INTERNAL_SERVER_ERROR)
    expect(error?.cause).toBe(genericError)
  })
})
