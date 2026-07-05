import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ExecutionContext, ICommand, IMediator, IQuery, IRequestContext } from '@/domain'
import { AppError, Result } from '@/domain'
import type { ResponseDto } from '@/shared'
import { ERROR_CODES, REQUEST_TYPE, STATUS_CODES } from '@/shared'

import { BaseController } from '../base.controller'

// Classe concreta di test per testare i metodi protetti della classe astratta
class TestController extends BaseController<string, string> {
  constructor(requestContext: IRequestContext<ExecutionContext>, mediator: IMediator) {
    super(requestContext, mediator)
  }

  // Implementazione minima richiesta dall'abstract
  async handle(request: string): Promise<ResponseDto<string>> {
    return this.ok(request)
  }

  // Metodi pubblici per testare i protetti
  public exposeOk<T>(data: T, status?: number) {
    return this.ok(data, status)
  }

  public exposeFail(error: AppError, details?: string) {
    return this.fail(error, details)
  }

  public exposeQuery(request: IQuery<string>) {
    return this._query(request)
  }

  public exposeSend(request: ICommand<string>) {
    return this._send(request)
  }
}

describe('BaseController', () => {
  let mockMediator: IMediator
  let mockRequestContext: IRequestContext<ExecutionContext>
  let controller: TestController

  beforeEach(() => {
    mockMediator = { send: vi.fn(), query: vi.fn() }
    mockRequestContext = {
      runAsync: vi.fn(),
      getContext: vi.fn().mockReturnValue(undefined),
    }
    controller = new TestController(mockRequestContext, mockMediator)
  })

  it('should initialize with mediator and requestContext', () => {
    expect(controller).toBeDefined()
  })

  it('should format successful response correctly via ok()', () => {
    const data = { id: 1, name: 'Test' }
    const response = controller.exposeOk(data, 201)

    expect(response.status).toBe(201)
    expect(response.data.success).toBe(true)
    if (!response.data.success) {
      throw new Error('Expected success response')
    }
    expect(response.data.data).toEqual(data)
  })

  it('should format error response correctly via fail()', () => {
    const error = AppError.create({
      code: ERROR_CODES.VALIDATION_FAILED,
      message: 'Validation failed',
      status: STATUS_CODES.BAD_REQUEST,
      name: 'TestController',
      cause: new Error('Invalid input'),
    })

    const details = 'Field missing'
    const response = controller.exposeFail(error, details)

    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST)
    expect(response.data.success).toBe(false)
    if (!response.data.success) {
      expect(response.data.error.message).toBe('Validation failed')
      expect(response.data.error.details).toBe(details)
    } else {
      throw new Error('Expected failure response')
    }
  })

  it('delegates _query to mediator.query with an AbortSignal', async () => {
    const expected = Result.ok('query-result')
    const queryMock = vi.fn().mockResolvedValue(expected)
    mockMediator.query = queryMock

    const request: IQuery<string> = {
      intent: 'TestQuery',
      type: REQUEST_TYPE.QUERY,
      payload: 'query-payload',
      cacheOptions: { ttl: 1000, cacheKey: 'test-key', bypassCache: false, consistentRead: false },
    }

    const result = await controller.exposeQuery(request)

    expect(queryMock).toHaveBeenCalledOnce()
    expect(queryMock).toHaveBeenCalledWith(request, expect.any(AbortSignal))
    expect(result).toBe(expected)
  })

  it('delegates _send to mediator.send with an AbortSignal', async () => {
    const expected = Result.ok('send-result')
    const sendMock = vi.fn().mockResolvedValue(expected)
    mockMediator.send = sendMock

    const request: ICommand<string> = {
      intent: 'TestCommand',
      type: REQUEST_TYPE.COMMAND,
      payload: 'command-payload',
    }

    const result = await controller.exposeSend(request)

    expect(sendMock).toHaveBeenCalledOnce()
    expect(sendMock).toHaveBeenCalledWith(request, expect.any(AbortSignal))
    expect(result).toBe(expected)
  })
})
