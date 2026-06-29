import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'

import type { IRequest, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import { PIPELINE_ERROR_CODES, PromiseHelper, STATUS_CODES } from '@/shared'

import { ConcurrencyRetryPipeline } from '../pipelines/concurrency-retry.pipeline'

type NextFn = () => Promise<ResultType<string>>

vi.mock('@/shared', async () => {
  const actual = await vi.importActual('@/shared')
  return {
    ...actual,
    GuidHelper: {
      isValidGuid: vi.fn(),
    },
    PromiseHelper: {
      delayWithJitter: vi.fn().mockResolvedValue(undefined),
    },
  }
})

describe('ConcurrencyRetryPipeline', () => {
  let mockNext: Mock<NextFn>
  const mockRequest: IRequest = { intent: 'TestCommand', type: 'COMMAND', signal: undefined }

  beforeEach(() => {
    mockNext = vi.fn<NextFn>()
    vi.clearAllMocks()
  })

  it('should return result immediately if successful', async () => {
    mockNext.mockResolvedValue(Result.ok('success'))
    const pipeline = new ConcurrencyRetryPipeline(3)

    const result = await pipeline.handle(mockRequest, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(result.getValueOrThrow()).toBe('success')
    expect(PromiseHelper.delayWithJitter).not.toHaveBeenCalled()
  })

  it('should not retry if error is NOT a concurrency conflict', async () => {
    const nonConcurrencyError: ResultType<string> = Result.fail(
      AppError.create({
        code: 'VALIDATION_ERROR',
        status: STATUS_CODES.BAD_REQUEST,
        name: 'TestCommand',
        message: 'Invalid',
        cause: new Error('Some validation error'),
      }),
    )

    mockNext.mockResolvedValue(nonConcurrencyError)
    const pipeline = new ConcurrencyRetryPipeline(3)

    const result = await pipeline.handle(mockRequest, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(result.isOk()).toBe(false)
    expect(result.getErrorOrThrow().code).not.toBe(PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT)
  })

  it('should retry on concurrency conflict and succeed eventually', async () => {
    const conflictError: ResultType<string> = Result.fail(
      AppError.create({
        code: PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT,
        status: STATUS_CODES.CONFLICT,
        name: 'TestCommand',
        message: 'Conflict',
        cause: new Error('Concurrency conflict occurred'),
      }),
    )

    // Fallisce due volte, poi successo
    mockNext
      .mockResolvedValueOnce(conflictError)
      .mockResolvedValueOnce(conflictError)
      .mockResolvedValueOnce(Result.ok('success'))

    const pipeline = new ConcurrencyRetryPipeline(3)
    const result = await pipeline.handle(mockRequest, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(3)
    expect(PromiseHelper.delayWithJitter).toHaveBeenCalledTimes(2)
    expect(result.getValueOrThrow()).toBe('success')
  })

  it('should fail after max retries exceeded', async () => {
    const conflictError: ResultType<string> = Result.fail(
      AppError.create({
        code: PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT,
        status: STATUS_CODES.CONFLICT,
        name: 'TestCommand',
        message: 'Conflict',
        cause: new Error('Concurrency conflict occurred'),
      }),
    )

    mockNext.mockResolvedValue(conflictError)
    const maxRetries = 2
    const pipeline = new ConcurrencyRetryPipeline(maxRetries)

    const result = await pipeline.handle(mockRequest, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(maxRetries)
    expect(result.isOk()).toBe(false)
    expect(result.getErrorOrThrow().code).toBe(PIPELINE_ERROR_CODES.CONCURRENCY_CONFLICT)
  })

  describe('Constructor Validation', () => {
    it('should throw if maxRetries is zero or negative', () => {
      expect(() => new ConcurrencyRetryPipeline(0)).toThrow()
      expect(() => new ConcurrencyRetryPipeline(-1)).toThrow()
    })

    it('should throw if delay config values are negative', () => {
      expect(() => new ConcurrencyRetryPipeline(3, { baseDelayMs: -1, maxJitterMs: 0 })).toThrow()
    })
  })
})
