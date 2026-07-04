import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ExecutionContext, IRequestContext, IStrategy, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import type { Guid } from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, STATUS_CODES } from '@/shared'

import { BaseHandler } from '../base-handler'

interface TestRequest {
  requestId: string
}
interface TestResponse {
  ok: true
}

class TestHandler extends BaseHandler<TestRequest, TestResponse> {
  async handle(): Promise<ResultType<TestResponse>> {
    return Result.ok({ ok: true })
  }

  async getCurrentUserForTest(request: TestRequest) {
    return this._getCurrentUser(request)
  }
}

const makeExecutionContext = (): ExecutionContext => ({
  context: {
    identity: {
      userId: 'user-1' as unknown as Guid,
      tenantId: 'tenant-1' as unknown as Guid,
      roles: ['admin'],
      permissions: ['read'],
    },
    network: {
      requestId: 'req-1' as unknown as Guid,
      clientIp: '127.0.0.1',
      userAgent: 'vitest',
      formatIndicator: 'json',
      path: '/test',
    },
    tracing: {
      correlationId: 'corr-1' as unknown as Guid,
      startTime: Date.now(),
      spanId: 'span-1',
      parentSpanId: 'parent-1',
    },
    messaging: undefined,
  },
  scope: {} as ExecutionContext['scope'],
})

const makeRequestContext = (
  executionContext?: ExecutionContext,
): IRequestContext<ExecutionContext> => ({
  getContext: vi.fn().mockReturnValue(executionContext),
  runAsync: vi.fn(),
})

const okStrategy = (): IStrategy<TestRequest> => ({
  execute: vi.fn().mockResolvedValue(Result.ok()),
})

describe('BaseHandler', () => {
  let request: TestRequest

  beforeEach(() => {
    request = { requestId: 'r-1' }
  })

  it('returns the identity when strategies pass and context exists', async () => {
    const context = makeExecutionContext()
    const requestContext = makeRequestContext(context)
    const handler = new TestHandler(requestContext)

    await expect(handler.getCurrentUserForTest(request)).resolves.toEqual(context.context.identity)
  })

  it('executes every strategy with the same request before returning identity', async () => {
    const context = makeExecutionContext()
    const requestContext = makeRequestContext(context)
    const firstExecute = vi.fn().mockResolvedValue(Result.ok())
    const secondExecute = vi.fn().mockResolvedValue(Result.ok())
    const first: IStrategy<TestRequest> = { execute: firstExecute }
    const second: IStrategy<TestRequest> = { execute: secondExecute }
    const handler = new TestHandler(requestContext, [first, second])

    const identity = await handler.getCurrentUserForTest(request)

    expect(firstExecute).toHaveBeenCalledOnce()
    expect(firstExecute).toHaveBeenCalledWith(request)
    expect(secondExecute).toHaveBeenCalledOnce()
    expect(secondExecute).toHaveBeenCalledWith(request)
    expect(identity).toEqual(context.context.identity)
  })

  it('throws the exact strategy error when a strategy fails', async () => {
    const requestContext = makeRequestContext(makeExecutionContext())
    const strategyError = AppError.create({
      code: ERROR_CODES.FORBIDDEN,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.FORBIDDEN],
      status: STATUS_CODES.FORBIDDEN,
      cause: new Error('forbidden'),
      name: 'StrategyError',
    })

    const failingStrategy: IStrategy<TestRequest> = {
      execute: vi.fn().mockResolvedValue(Result.fail(strategyError)),
    }

    const handler = new TestHandler(requestContext, [failingStrategy])

    await expect(handler.getCurrentUserForTest(request)).rejects.toBe(strategyError)
  })

  it('stops the pipeline after the first failing strategy', async () => {
    const requestContext = makeRequestContext(makeExecutionContext())
    const strategyError = AppError.create({
      code: ERROR_CODES.UNAUTHORIZED,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      status: STATUS_CODES.UNAUTHORIZED,
      cause: new Error('unauthorized'),
      name: 'StrategyError',
    })

    const firstExecute = vi.fn().mockResolvedValue(Result.fail(strategyError))
    const secondExecute = vi.fn().mockResolvedValue(Result.ok())
    const first: IStrategy<TestRequest> = { execute: firstExecute }
    const second: IStrategy<TestRequest> = { execute: secondExecute }

    const handler = new TestHandler(requestContext, [first, second])

    await expect(handler.getCurrentUserForTest(request)).rejects.toBe(strategyError)
    expect(firstExecute).toHaveBeenCalledOnce()
    expect(secondExecute).not.toHaveBeenCalled()
  })

  it('throws authentication AppError when request context is missing', async () => {
    const requestContext = makeRequestContext(undefined)
    const handler = new TestHandler(requestContext, [okStrategy()])

    const error = await handler.getCurrentUserForTest(request).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(AppError)
    expect(error).toMatchObject({
      code: ERROR_CODES.AUTHENTICATION_FAILED,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.AUTHENTICATION_FAILED],
      status: STATUS_CODES.UNAUTHORIZED,
      name: 'TestHandler',
    })
    expect((error as AppError).cause).toBeInstanceOf(Error)
    expect(((error as AppError).cause as Error).message).toBe('User is not authenticated.')
  })
})
