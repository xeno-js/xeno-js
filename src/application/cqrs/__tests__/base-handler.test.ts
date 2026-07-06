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

  async getCurrentUserForTest() {
    return this._getCurrentContext()
  }

  async validateCurrentForTest(req: TestRequest) {
    return this._validateCurrent(req)
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

  it('returns the identity when context exists', async () => {
    const context = makeExecutionContext()
    const currentUser = {
      userId: context.context.identity?.userId,
      tenantId: context.context.identity?.tenantId,
    }
    const requestContext = makeRequestContext(context)
    const handler = new TestHandler(requestContext)

    await expect(handler.getCurrentUserForTest()).resolves.toEqual(currentUser)
  })

  it('executes every strategy with the same request', async () => {
    const context = makeExecutionContext()
    const requestContext = makeRequestContext(context)
    const firstExecute = vi.fn().mockResolvedValue(Result.ok())
    const secondExecute = vi.fn().mockResolvedValue(Result.ok())
    const first: IStrategy<TestRequest> = { execute: firstExecute }
    const second: IStrategy<TestRequest> = { execute: secondExecute }
    const handler = new TestHandler(requestContext, [first, second])

    await handler.validateCurrentForTest(request)

    expect(firstExecute).toHaveBeenCalledOnce()
    expect(secondExecute).toHaveBeenCalledOnce()
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

    await expect(handler.validateCurrentForTest(request)).rejects.toBe(strategyError)
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

    await expect(handler.validateCurrentForTest(request)).rejects.toBe(strategyError)
    expect(firstExecute).toHaveBeenCalledOnce()
    expect(secondExecute).not.toHaveBeenCalled()
  })

  it('return void when all strategies pass', async () => {
    const requestContext = makeRequestContext(makeExecutionContext())
    const handler = new TestHandler(requestContext, [okStrategy()])

    await expect(handler.validateCurrentForTest(request)).resolves.toBeUndefined()
  })
})
