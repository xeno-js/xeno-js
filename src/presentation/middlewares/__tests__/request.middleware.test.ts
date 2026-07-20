import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  ApplicationRegistry,
  IFactory,
  IGateKeeper,
  ILogger,
  IRequestContext,
  IServiceExtractor,
  IServiceScope,
  RequestContext,
} from '@/domain'
import type { HttpHeaders, HttpMethod, Metadata } from '@/shared'
import { ERROR_CODES, STATUS_CODES } from '@/shared'

import { AppError } from '../../../domain/errors/app-error'
import { Result } from '../../../domain/results/result'
import { RequestContextMiddleware } from '../request.middleware'

const VALID_GUID = '550e8400-e29b-41d4-a716-446655440000'

// --- Factory helpers ----------------------------------------------------------

function makeScope() {
  const disposeMock = vi.fn()
  const resolveMock = vi.fn()
  const scope = { resolve: resolveMock, dispose: disposeMock } as unknown as IServiceScope
  return { scope, mocks: { disposeMock, resolveMock } }
}

function makeFactory(scope: IServiceScope) {
  const createMock = vi.fn().mockReturnValue(scope)
  const factory = { create: createMock } as unknown as IFactory<void, IServiceScope>
  return { factory, mocks: { createMock } }
}

function makeExtractor(meta: Partial<Metadata> = {}): IServiceExtractor<HttpHeaders, Metadata> {
  const full: Metadata = {
    correlationId: undefined,
    requestId: undefined,
    token: undefined,
    clientIp: undefined,
    spanId: undefined,
    parentSpanId: undefined,
    formatIndicator: 'application/json',
    userAgent: undefined,
    returnAddress: undefined,
    sequence: {
      sequenceId: undefined,
      position: undefined,
      size: undefined,
    },
    expiration: undefined,
    ...meta,
  }
  return { extract: vi.fn().mockReturnValue(full) }
}

function makeGateKeeper(result: Awaited<ReturnType<IGateKeeper['authenticate']>>): IGateKeeper {
  return { authenticate: vi.fn().mockResolvedValue(result) }
}

function makeRegexRouteMatcher(isPublic: boolean): {
  match: (req: { method: HttpMethod; path: string }) => boolean
} {
  return {
    match: ({ method: _method, path: _path }) => isPublic,
  }
}

function makeLogger(): {
  logger: ILogger
  warnMock: ReturnType<typeof vi.fn>
  errorMock: ReturnType<typeof vi.fn>
} {
  const warnMock = vi.fn()
  const errorMock = vi.fn()
  const logger: ILogger = {
    info: vi.fn(),
    warn: warnMock,
    error: errorMock,
    debug: vi.fn(),
  }
  return { logger, warnMock, errorMock }
}

function makeRequestContextFactory() {
  const runAsyncMock = vi
    .fn()
    .mockImplementation((ctx: RequestContext, fn: () => Promise<unknown>) => fn())
  const getContextMock = vi.fn()
  const getIdentityMock = vi.fn()
  const getScopeMock = vi.fn()
  const getNetworkContextMock = vi.fn()

  const ctx = {
    runAsync: runAsyncMock,
    getContext: getContextMock,
    getIdentity: getIdentityMock,
    getScope: getScopeMock,
    getNetworkContext: getNetworkContextMock,
  } as unknown as IRequestContext<RequestContext, ApplicationRegistry<unknown>>

  return {
    ctx,
    mocks: {
      runAsyncMock,
    },
  }
}

const fakeIdentity = {
  userId: '00000000-0000-0000-0000-000000000001' as const,
  tenantId: '00000000-0000-0000-0000-000000000002' as const,
  roles: ['admin'] as string[],
  permissions: [] as string[],
}
const headers: HttpHeaders = { authorization: 'Bearer tok' }
const path = '/api/test'
const method: HttpMethod = 'GET'

// --- Tests --------------------------------------------------------------------

describe('RequestContextMiddleware', () => {
  let scopeFactory: ReturnType<typeof makeScope>
  let factoryFactory: ReturnType<typeof makeFactory>
  let requestContextFactory: ReturnType<typeof makeRequestContextFactory>

  beforeEach(() => {
    scopeFactory = makeScope()
    factoryFactory = makeFactory(scopeFactory.scope)
    requestContextFactory = makeRequestContextFactory()
  })

  it('calls next and returns its result when authentication succeeds', async () => {
    const extractor = makeExtractor()
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )
    const next = vi
      .fn()
      .mockResolvedValue({ status: 200, ok: true, headers: {}, data: { success: true } })

    const response = await middleware.execute({ method, path }, headers, next)

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
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    const response = await middleware.execute({ method, path }, headers, next)

    expect(response.ok).toBe(true)
  })

  it('generates correlationId and requestId when metadata omits them', async () => {
    const extractor = makeExtractor({ correlationId: undefined, requestId: undefined })
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi
      .fn()
      .mockResolvedValue({ status: 200, ok: true, headers: {}, data: { success: true } })
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()

    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    const response = await middleware.execute({ method, path }, headers, next)

    expect(response.ok).toBe(true)
  })

  it('builds ExecutionContext with correct network, tracing, identity and scope', async () => {
    let capturedCtx: RequestContext | undefined
    const runAsyncSpy = vi
      .fn()
      .mockImplementation((ctx: RequestContext, fn: () => Promise<unknown>) => {
        capturedCtx = ctx
        return fn()
      })
    requestContextFactory.ctx.runAsync = runAsyncSpy

    const extractor = makeExtractor({
      clientIp: '127.0.0.1',
      spanId: VALID_GUID,
      correlationId: 'aaaaaaaa-0000-0000-0000-000000000001',
    })
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi.fn().mockResolvedValue({ status: 200, ok: true, headers: {}, data: {} })
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    await middleware.execute({ method, path }, headers, next)

    expect(runAsyncSpy).toHaveBeenCalledOnce()
    expect(capturedCtx).toBeDefined()
    expect(capturedCtx!.network.clientIp).toBe('127.0.0.1')
    expect(capturedCtx!.network.path).toBe(path)
    expect(capturedCtx!.tracing.spanId).toBe(VALID_GUID)
    expect(capturedCtx!.identity).toEqual(fakeIdentity)
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
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    const response = await middleware.execute({ method, path }, headers, next)

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
    const routeMatcher = makeRegexRouteMatcher(false)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    await middleware.execute({ method, path }, headers, vi.fn())

    expect(factoryFactory.mocks.createMock).not.toHaveBeenCalled()
    expect(scopeFactory.mocks.disposeMock).not.toHaveBeenCalled()
  })

  it('catches extractor errors and returns SYSTEM_ERROR response', async () => {
    const extractor = {
      extract: vi.fn().mockImplementation(() => {
        throw new Error('parse fail')
      }),
    }
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    const response = await middleware.execute({ method, path }, headers, vi.fn())

    expect(response.ok).toBe(false)
    expect((response.data as { error?: { code: string } }).error?.code).toBe(
      ERROR_CODES.SYSTEM_ERROR,
    )
  })

  it('catches gateKeeper errors and returns SYSTEM_ERROR response', async () => {
    const extractor = makeExtractor()
    const gateKeeper = { authenticate: vi.fn().mockRejectedValue(new Error('auth crash')) }
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    const response = await middleware.execute({ method, path }, headers, vi.fn())

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
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    const response = await middleware.execute({ method, path }, headers, vi.fn())

    expect((response.data as { error?: { details: string } }).error?.details).toBe(
      '[Fatal System Error] Exception caught during request handling on path: /api/test',
    )
  })

  it('includes String(error) as details in SYSTEM_ERROR when non-Error is thrown', async () => {
    const extractor = {
      extract: vi.fn().mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw 'string error'
      }),
    }
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    const response = await middleware.execute({ method, path }, headers, vi.fn())

    expect((response.data as { error?: { details: string } }).error?.details).toBe(
      '[Fatal System Error] Exception caught during request handling on path: /api/test',
    )
  })

  it('uses messagingContext with returnAddress, expiration and sequence from metadata', async () => {
    let capturedCtx: RequestContext | undefined
    const runAsyncSpy = vi
      .fn()
      .mockImplementation((ctx: RequestContext, fn: () => Promise<unknown>) => {
        capturedCtx = ctx
        return fn()
      })
    requestContextFactory.ctx.runAsync = runAsyncSpy

    const extractor = makeExtractor({
      returnAddress: 'return-addr',
      expiration: 5000,
      sequence: {
        sequenceId: 'seq-123',
        position: 1,
        size: 10,
      },
    })
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi.fn().mockResolvedValue({ status: 200, ok: true, headers: {}, data: {} })
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    await middleware.execute({ method, path }, headers, next)

    expect(capturedCtx).toBeDefined()
    expect(capturedCtx!.messaging?.returnAddress).toBe('return-addr')
    expect(capturedCtx!.messaging?.expiration).toBe(5000)
    expect(capturedCtx!.messaging?.sequence).toEqual({
      sequenceId: 'seq-123',
      position: 1,
      size: 10,
    })
  })

  it('uses parentSpanId from metadata when provided', async () => {
    let capturedCtx: RequestContext | undefined
    const runAsyncSpy = vi
      .fn()
      .mockImplementation((ctx: RequestContext, fn: () => Promise<unknown>) => {
        capturedCtx = ctx
        return fn()
      })
    requestContextFactory.ctx.runAsync = runAsyncSpy

    const extractor = makeExtractor({
      parentSpanId: 'parent-span-123',
    })
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi.fn().mockResolvedValue({ status: 200, ok: true, headers: {}, data: {} })
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    await middleware.execute({ method, path }, headers, next)

    expect(capturedCtx).toBeDefined()
    expect(capturedCtx!.tracing.parentSpanId).toBe('parent-span-123')
  })

  it('uses formatIndicator from metadata for response Content-Type header', async () => {
    const extractor = makeExtractor({
      formatIndicator: 'application/xml',
    })
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi
      .fn()
      .mockResolvedValue({ status: 200, ok: true, headers: {}, data: { success: true } })
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    const response = await middleware.execute({ method, path }, headers, next)

    expect(response.status).toBe(200)
  })

  it('includes userAgent and returnAddress in network and messaging contexts', async () => {
    let capturedCtx: RequestContext | undefined
    const runAsyncSpy = vi
      .fn()
      .mockImplementation((ctx: RequestContext, fn: () => Promise<unknown>) => {
        capturedCtx = ctx
        return fn()
      })
    requestContextFactory.ctx.runAsync = runAsyncSpy

    const extractor = makeExtractor({
      userAgent: 'Mozilla/5.0',
      returnAddress: 'queue://reply',
    })
    const gateKeeper = makeGateKeeper(Result.ok(fakeIdentity))
    const next = vi.fn().mockResolvedValue({ status: 200, ok: true, headers: {}, data: {} })
    const routeMatcher = makeRegexRouteMatcher(true)
    const { logger } = makeLogger()
    const middleware = new RequestContextMiddleware(
      routeMatcher,
      requestContextFactory.ctx,
      extractor,
      gateKeeper,
      logger,
    )

    await middleware.execute({ method, path }, headers, next)

    expect(capturedCtx).toBeDefined()
    expect(capturedCtx!.network.userAgent).toBe('Mozilla/5.0')
    expect(capturedCtx!.messaging?.returnAddress).toBe('queue://reply')
  })
})
