import { describe, expect, it, vi } from 'vitest'

import type { ExecutionContext, IRequest, IRequestContext, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { Guid } from '@/shared'

import { BaseHandler } from '../base-handler'

interface TestRequest extends IRequest<TestResponse> {
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
      isPublic: false,
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

describe('BaseHandler', () => {
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
})
