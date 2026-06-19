import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  ExecutionContext,
  IGateKeeper,
  IRequestContext,
  IServiceContainer,
  IServiceExtractor,
  IServiceScope,
} from '@/domain'
import type { HttpHeaders, Metadata } from '@/shared'
import { ERROR_CODES, STATUS_CODES } from '@/shared'

import { AppError } from '../../../domain/errors/app-error'
import { Result } from '../../../domain/results/result'
import { RequestContextMiddleware } from '../request.middleware'

// --- Factory helpers ----------------------------------------------------------

function makeScope() {
  const disposeMock = vi.fn()
  const resolveMock = vi.fn()
  const scope = { resolve: resolveMock, dispose: disposeMock } as unknown as IServiceScope
  return { scope, mocks: { disposeMock, resolveMock } }
}

function makeContainer(scope: IServiceScope) {
  const createScopeMock = vi.fn().mockReturnValue(scope)
  const container = { createScope: createScopeMock } as unknown as IServiceContainer
  return { container, mocks: { createScopeMock } }
}

function makeExtractor(meta: Partial<Metadata> = {}): IServiceExtractor<HttpHeaders, Metadata> {
  const full: Metadata = {
    correlationId: undefined,
    requestId: undefined,
    token: undefined,
    clientIp: undefined,
    spanId: undefined,
    ...meta,
  }
  return { extract: vi.fn().mockReturnValue(full) }
}

function makeGateKeeper(result: Awaited<ReturnType<IGateKeeper['authenticate']>>): IGateKeeper {
  return { authenticate: vi.fn().mockResolvedValue(result) }
}

function makeRequestContext() {
  const runAsyncMock = vi
    .fn()
    .mockImplementation((_ctx: ExecutionContext, fn: () => Promise<unknown>) => fn())
  const getContextMock = vi.fn()
  const ctx = {
    runAsync: runAsyncMock,
    getContext: getContextMock,
  } as unknown as IRequestContext<ExecutionContext>
  return { ctx, mocks: { runAsyncMock, getContextMock } }
}

const fakeIdentity = {
  userId: '00000000-0000-0000-0000-000000000001' as const,
  tenantId: '00000000-0000-0000-0000-000000000002' as const,
  roles: ['admin'] as string[],
  permissions: [] as string[],
}
const headers: HttpHeaders = { authorization: 'Bearer tok' }

// --- Tests --------------------------------------------------------------------

describe('RequestContextMiddleware', () => {
  let scopeFactory: ReturnType<typeof makeScope>
  let containerFactory: ReturnType<typeof makeContainer>
  let requestContextFactory: ReturnType<typeof makeRequestContext>

  beforeEach(() => {
    scopeFactory = makeScope()
    containerFactory = makeContainer(scopeFactory.scope)
    requestContextFactory = makeRequestContext()
  })

  it('calls next and returns its result when authentication succeeds', async () => {
    const extractor = makeExtractor()
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )
    const next = vi
      .fn()
      .mockResolvedValue({ status: 200, ok: true, headers: {}, data: { success: true } })

    const response = await middleware.execute(headers, next)

    expect(response.ok).toBe(true)
    expect(next).toHaveBeenCalledOnce()
  })

  it('uses correlationId and requestId from metadata when provided', async () => {
    const extractor = makeExtractor({
      correlationId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      requestId: 'ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj',
    })
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi
      .fn()
      .mockResolvedValue({ status: 200, ok: true, headers: {}, data: { success: true } })
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    const response = await middleware.execute(headers, next)

    expect(response.ok).toBe(true)
  })

  it('generates correlationId and requestId when metadata omits them', async () => {
    const extractor = makeExtractor({ correlationId: undefined, requestId: undefined })
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi
      .fn()
      .mockResolvedValue({ status: 200, ok: true, headers: {}, data: { success: true } })
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    const response = await middleware.execute(headers, next)

    expect(response.ok).toBe(true)
  })

  it('builds ExecutionContext with correct network, tracing, identity and scope', async () => {
    let capturedCtx: ExecutionContext | undefined
    const runAsyncSpy = vi
      .fn()
      .mockImplementation((ctx: ExecutionContext, fn: () => Promise<unknown>) => {
        capturedCtx = ctx
        return fn()
      })
    requestContextFactory.ctx.runAsync = runAsyncSpy

    const extractor = makeExtractor({
      clientIp: '127.0.0.1',
      spanId: 'span-1',
      correlationId: 'aaaaaaaa-0000-0000-0000-000000000001',
    })
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi.fn().mockResolvedValue({ status: 200, ok: true, headers: {}, data: {} })
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    await middleware.execute(headers, next)

    expect(runAsyncSpy).toHaveBeenCalledOnce()
    expect(capturedCtx?.context.network.clientIp).toBe('127.0.0.1')
    expect(capturedCtx?.context.tracing.spanId).toBe('span-1')
    expect(capturedCtx?.context.identity).toEqual(fakeIdentity)
    expect(capturedCtx?.scope).toBe(scopeFactory.scope)
  })

  it('disposes scope after successful execution', async () => {
    const extractor = makeExtractor()
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi.fn().mockResolvedValue({ status: 200, ok: true, headers: {}, data: {} })
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    await middleware.execute(headers, next)

    expect(scopeFactory.mocks.disposeMock).toHaveBeenCalledOnce()
  })

  it('returns error response when authentication fails', async () => {
    const authError = AppError.create({
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Unauthorized',
      status: STATUS_CODES.UNAUTHORIZED,
      name: 'UnauthorizedError',
      cause: undefined,
    })
    const extractor = makeExtractor()
    const gateKeeper = makeGateKeeper(Result.fail(authError))
    const next = vi.fn()
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    const response = await middleware.execute(headers, next)

    expect(response.ok).toBe(false)
    expect((response.data as { error?: { code: string } }).error?.code).toBe(
      ERROR_CODES.UNAUTHORIZED,
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('does not create scope when authentication fails', async () => {
    const authError = AppError.create({
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'No',
      status: STATUS_CODES.UNAUTHORIZED,
      name: 'UnauthorizedError',
      cause: undefined,
    })
    const extractor = makeExtractor()
    const gateKeeper = makeGateKeeper(Result.fail(authError))
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    await middleware.execute(headers, vi.fn())

    expect(containerFactory.mocks.createScopeMock).not.toHaveBeenCalled()
    expect(scopeFactory.mocks.disposeMock).not.toHaveBeenCalled()
  })

  it('catches extractor errors and returns SYSTEM_ERROR response', async () => {
    const extractor = {
      extract: vi.fn().mockImplementation(() => {
        throw new Error('parse fail')
      }),
    }
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    const response = await middleware.execute(headers, vi.fn())

    expect(response.ok).toBe(false)
    expect((response.data as { error?: { code: string } }).error?.code).toBe(
      ERROR_CODES.SYSTEM_ERROR,
    )
  })

  it('catches gateKeeper errors and returns SYSTEM_ERROR response', async () => {
    const extractor = makeExtractor()
    const gateKeeper = { authenticate: vi.fn().mockRejectedValue(new Error('auth crash')) }
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    const response = await middleware.execute(headers, vi.fn())

    expect(response.ok).toBe(false)
    expect((response.data as { error?: { code: string } }).error?.code).toBe(
      ERROR_CODES.SYSTEM_ERROR,
    )
  })

  it('includes error.message as details in SYSTEM_ERROR when Error is thrown', async () => {
    const extractor = {
      extract: vi.fn().mockImplementation(() => {
        throw new Error('detail msg')
      }),
    }
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    const response = await middleware.execute(headers, vi.fn())

    expect((response.data as { error?: { details: string } }).error?.details).toBe('detail msg')
  })

  it('includes String(error) as details in SYSTEM_ERROR when non-Error is thrown', async () => {
    const extractor = {
      extract: vi.fn().mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw 'string error'
      }),
    }
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const middleware = new RequestContextMiddleware(
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      containerFactory.container,
    )

    const response = await middleware.execute(headers, vi.fn())

    expect((response.data as { error?: { details: string } }).error?.details).toBe('string error')
  })
})
