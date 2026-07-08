import { describe, expect, it, vi } from 'vitest'

import type { Delegate, IRequest, IStrategy } from '@/domain'
import { AppError, Result } from '@/domain'
import { REQUEST_TYPE } from '@/shared'

import { ValidationPipeline } from '../validation.pipeline'

const request: IRequest<string> = {
  intent: 'test',
  type: REQUEST_TYPE.COMMAND,
}

function makeAppError(): AppError {
  return AppError.create({
    message: 'validation failed',
    code: 'VALIDATION',
    status: 400,
    name: 'ValidationError',
    cause: undefined,
  })
}

function makeValidator(result: Awaited<ReturnType<IStrategy<IRequest, boolean>['execute']>>): {
  strategy: IStrategy<IRequest, boolean>
  executeMock: ReturnType<typeof vi.fn>
} {
  const executeMock = vi.fn().mockResolvedValue(result)
  return { strategy: { execute: executeMock }, executeMock }
}

describe('ValidationPipeline', () => {
  it('calls next when there are no validators', async () => {
    const pipeline = new ValidationPipeline<IRequest<string>, string>([])
    const next: Delegate<string> = vi.fn().mockResolvedValue(Result.ok('done'))

    const result = await pipeline.handle(request, next)

    expect(next).toHaveBeenCalledOnce()
    expect(result.isOk()).toBe(true)
  })

  it('calls next when all validators pass', async () => {
    const { strategy: v1, executeMock: exec1 } = makeValidator(Result.ok(true))
    const { strategy: v2, executeMock: exec2 } = makeValidator(Result.ok(true))
    const pipeline = new ValidationPipeline<IRequest<string>, string>([v1, v2])
    const next: Delegate<string> = vi.fn().mockResolvedValue(Result.ok('done'))

    const result = await pipeline.handle(request, next)

    expect(exec1).toHaveBeenCalledWith(request)
    expect(exec2).toHaveBeenCalledWith(request)
    expect(next).toHaveBeenCalledOnce()
    expect(result.isOk()).toBe(true)
  })

  it('returns fail result and short-circuits when first validator fails', async () => {
    const error = makeAppError()
    const { strategy: v1 } = makeValidator(Result.fail(error))
    const { strategy: v2, executeMock: exec2 } = makeValidator(Result.ok(true))
    const pipeline = new ValidationPipeline<IRequest<string>, string>([v1, v2])
    const next: Delegate<string> = vi.fn()

    const result = await pipeline.handle(request, next)

    expect(result.isOk()).toBe(false)
    expect(result.getErrorOrThrow()).toBe(error)
    expect(exec2).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('stops at the first failing validator among many', async () => {
    const error = makeAppError()
    const { strategy: v1 } = makeValidator(Result.ok(true))
    const { strategy: v2 } = makeValidator(Result.fail(error))
    const { strategy: v3, executeMock: exec3 } = makeValidator(Result.ok(true))
    const pipeline = new ValidationPipeline<IRequest<string>, string>([v1, v2, v3])
    const next: Delegate<string> = vi.fn()

    const result = await pipeline.handle(request, next)

    expect(result.isOk()).toBe(false)
    expect(result.getErrorOrThrow()).toBe(error)
    expect(exec3).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('returns the result of next when single validator passes', async () => {
    const { strategy: v1 } = makeValidator(Result.ok(true))
    const expected = Result.ok('expected-value')
    const pipeline = new ValidationPipeline<IRequest<string>, string>([v1])
    const next: Delegate<string> = vi.fn().mockResolvedValue(expected)

    const result = await pipeline.handle(request, next)

    expect(result).toBe(expected)
  })
})
