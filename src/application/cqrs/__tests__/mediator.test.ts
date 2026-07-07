import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  ExecutionContext,
  ICommand,
  IHandler,
  IPipelineBehavior,
  IQuery,
  IRequestContext,
} from '@/domain'
import { AppError, Result } from '@/domain'
import type { IServiceScope } from '@/domain/contracts/container/iservice-scope.contracts'
import type { InjectionToken } from '@/shared'
import {
  ERROR_CODE_MESSAGES,
  ERROR_CODES,
  REQUEST_TYPE,
  STATUS_CODES,
  TokenHelper,
  TOKENS,
} from '@/shared'

import { Mediator } from '../mediator'

describe('Mediator', () => {
  const createScope = () => {
    const resolveMock = vi.fn<(token: InjectionToken<unknown>) => unknown>()
    const scope: IServiceScope = {
      resolve: ((token) => resolveMock(token)) as IServiceScope['resolve'],
      dispose: vi.fn(),
    }

    return { scope, resolveMock }
  }

  const createRequestContext = (ctx: ExecutionContext | undefined) => {
    const getContextMock = vi.fn().mockReturnValue(ctx)
    const requestContext: IRequestContext<ExecutionContext> = {
      runAsync: vi.fn(),
      getContext: getContextMock,
    }

    return { requestContext, getContextMock }
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a failed result when command signal is already aborted', async () => {
    const abortController = new AbortController()
    abortController.abort()

    const { requestContext, getContextMock } = createRequestContext(undefined)
    const mediator = new Mediator(requestContext)

    const command: ICommand<string> = {
      intent: 'AbortCommand',
      type: REQUEST_TYPE.COMMAND,
      payload: 'test-payload',
    }

    const result = await mediator.send(command, abortController.signal)

    expect(getContextMock).not.toHaveBeenCalled()
    expect(result.isOk()).toBe(false)

    const error = result.getErrorOrThrow()
    expect(error).toBeInstanceOf(AppError)
    expect(error.code).toBe(ERROR_CODES.ABORTED)
    expect(error.status).toBe(STATUS_CODES.ABORTED)
    expect(error.name).toBe(command.intent)
  })

  it('returns SCOPE_NOT_AVAILABLE when request context has no scope', async () => {
    const { requestContext, getContextMock } = createRequestContext(undefined)
    const mediator = new Mediator(requestContext)

    const command: ICommand<string> = {
      intent: 'ScopeMissingCommand',
      type: REQUEST_TYPE.COMMAND,
      payload: 'test-payload',
    }

    const result = await mediator.send(command, new AbortController().signal)

    expect(getContextMock).toHaveBeenCalledTimes(1)
    expect(result.isOk()).toBe(false)

    const error = result.getErrorOrThrow()
    expect(error.code).toBe(ERROR_CODES.SCOPE_NOT_AVAILABLE)
    expect(error.status).toBe(STATUS_CODES.INTERNAL_SERVER_ERROR)
    expect(error.name).toBe(command.intent)
    expect(error.message).toBe(ERROR_CODE_MESSAGES[ERROR_CODES.SCOPE_NOT_AVAILABLE])
    expect(error.cause).toBeInstanceOf(Error)
  })

  it('throws when no handler token is registered for request intent', async () => {
    const pipelineToken = TokenHelper.createToken<
      IPipelineBehavior<ICommand<string, string>, string>
    >(TOKENS.COMMAND_PIPELINES_BEHAVIOR)
    const mockPipeline: IPipelineBehavior<ICommand<string, string>, string> = {
      handle: async (_request, next) => next(),
    }

    const { scope, resolveMock } = createScope()

    resolveMock.mockImplementation((token) => {
      if (token === pipelineToken) {
        return mockPipeline
      }
      return undefined
    })

    const { requestContext } = createRequestContext({ scope } as ExecutionContext)
    const mediator = new Mediator(requestContext)

    const command: ICommand<string, string> = {
      intent: 'NoHandlerIntent',
      type: REQUEST_TYPE.COMMAND,
      payload: 'test-payload',
    }

    await expect(mediator.send(command, new AbortController().signal)).rejects.toThrow(
      `errors.handler_not_found`,
    )

    expect(resolveMock).toHaveBeenCalledWith(pipelineToken)
  })

  it('resolves handler and command pipeline then executes next delegate via send', async () => {
    const command: ICommand<string, string> = {
      intent: 'CommandIntent',
      type: REQUEST_TYPE.COMMAND,
      payload: 'test-payload',
    }

    const handlerToken = TokenHelper.createToken<IHandler<ICommand<string, string>, string>>(
      command.intent,
    )
    const pipelineToken = TokenHelper.createToken<
      IPipelineBehavior<ICommand<string, string>, string>
    >(TOKENS.COMMAND_PIPELINES_BEHAVIOR)

    const handler: IHandler<ICommand<string, string>, string> = {
      handle: async () => Result.ok('command-ok'),
    }
    const handlerHandleSpy = vi.spyOn(handler, 'handle')

    const pipeline: IPipelineBehavior<ICommand<string, string>, string> = {
      handle: async (_request, next) => next(),
    }
    const pipelineHandleSpy = vi.spyOn(pipeline, 'handle')

    const { scope, resolveMock } = createScope()
    resolveMock.mockImplementation((token) => {
      if (token === handlerToken) {
        return handler
      }

      if (token === pipelineToken) {
        return pipeline
      }

      throw new Error('Unexpected token')
    })

    const { requestContext } = createRequestContext({ scope } as ExecutionContext)
    const mediator = new Mediator(requestContext)

    const signal = new AbortController().signal
    const result = await mediator.send(command, signal)

    expect(resolveMock).toHaveBeenNthCalledWith(1, pipelineToken)
    expect(resolveMock).toHaveBeenNthCalledWith(2, handlerToken)
    expect(pipelineHandleSpy).toHaveBeenCalledTimes(1)
    expect(handlerHandleSpy).toHaveBeenCalledWith(command, signal)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBe('command-ok')
  })

  it('resolves handler and query pipeline then executes next delegate via query', async () => {
    const query: IQuery<number, number> = {
      intent: 'QueryIntent',
      type: REQUEST_TYPE.QUERY,
      payload: 0,
      cacheOptions: { ttl: 1000, cacheKey: 'test-key', bypassCache: false, consistentRead: false },
    }

    const handlerToken = TokenHelper.createToken<IHandler<IQuery<number, number>, number>>(
      query.intent,
    )
    const pipelineToken = TokenHelper.createToken<
      IPipelineBehavior<IQuery<number, number>, number>
    >(TOKENS.QUERY_PIPELINES_BEHAVIOR)

    const handler: IHandler<IQuery<number, number>, number> = {
      handle: async () => Result.ok(42),
    }
    const handlerHandleSpy = vi.spyOn(handler, 'handle')

    const pipeline: IPipelineBehavior<IQuery<number, number>, number> = {
      handle: async (_request, next) => next(),
    }
    const pipelineHandleSpy = vi.spyOn(pipeline, 'handle')

    const { scope, resolveMock } = createScope()
    resolveMock.mockImplementation((token) => {
      if (token === handlerToken) {
        return handler
      }

      if (token === pipelineToken) {
        return pipeline
      }

      throw new Error('Unexpected token')
    })

    const { requestContext } = createRequestContext({ scope } as ExecutionContext)
    const mediator = new Mediator(requestContext)

    const signal = new AbortController().signal

    const result = await mediator.query(query, signal)

    expect(resolveMock).toHaveBeenNthCalledWith(1, pipelineToken)
    expect(resolveMock).toHaveBeenNthCalledWith(2, handlerToken)
    expect(pipelineHandleSpy).toHaveBeenCalledTimes(1)
    expect(handlerHandleSpy).toHaveBeenCalledWith(query, signal)
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBe(42)
  })
})
