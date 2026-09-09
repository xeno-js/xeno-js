import type { IRequest } from '@xeno-js/shared'
import { Result } from '@xeno-js/shared'
import { AppError } from '@xeno-js/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthorizationPipeline } from '../authorization.pipeline'

describe('AuthorizationPipeline', () => {
  let mockNext: () => Promise<Result<string>>
  let mockRequest: IRequest<{ id: string }>

  beforeEach(() => {
    mockNext = vi.fn().mockResolvedValue(Result.ok('success'))
    mockRequest = { intent: 'TEST_INTENT', type: 'COMMAND' }
  })

  it('should call next() if all strategies succeed', async () => {
    const strategy1 = { execute: vi.fn().mockResolvedValue(Result.ok()) }
    const strategy2 = { execute: vi.fn().mockResolvedValue(Result.ok()) }

    const pipeline = new AuthorizationPipeline([strategy1, strategy2])

    const result = await pipeline.handle(mockRequest, mockNext)

    expect(strategy1.execute).toHaveBeenCalledWith(mockRequest)
    expect(strategy2.execute).toHaveBeenCalledWith(mockRequest)
    expect(mockNext).toHaveBeenCalled()
    expect(result.isOk()).toBe(true)
  })

  it('should stop and return failure if a strategy fails', async () => {
    const authError = Result.fail(
      AppError.create({
        code: 'AUTH_FAILED',
        message: 'Unauthorized',
        status: 403,
        name: 'Intent',
        cause: new Error('User does not have permission'),
      }),
    )

    const strategy1 = { execute: vi.fn().mockResolvedValue(Result.ok()) }
    const strategyFail = { execute: vi.fn().mockResolvedValue(authError) }
    const strategy2 = { execute: vi.fn().mockResolvedValue(Result.ok()) }

    const pipeline = new AuthorizationPipeline([strategy1, strategyFail, strategy2])

    const result = await pipeline.handle(mockRequest, mockNext)

    expect(strategyFail.execute).toHaveBeenCalled()
    expect(strategy2.execute).not.toHaveBeenCalled()
    expect(mockNext).not.toHaveBeenCalled()
    expect(result.isOk()).toBe(false)
    expect(result.getErrorOrThrow()).toBe(authError.getErrorOrThrow())
  })

  it('should continue to next() if strategies array is empty', async () => {
    const pipeline = new AuthorizationPipeline([])

    await pipeline.handle(mockRequest, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })
})
