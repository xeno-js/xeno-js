import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { IMediator } from '@/domain'
import { AppError } from '@/domain'
import type { ResponseDto } from '@/shared'
import { PIPELINE_ERROR_CODES, STATUS_CODES } from '@/shared'

import { BaseController } from '../base.controller'

// Classe concreta di test per testare i metodi protetti della classe astratta
class TestController extends BaseController<string, string> {
  constructor(mediator: IMediator) {
    super(mediator)
  }

  public getMediator(): IMediator {
    return this._mediator
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
}

describe('BaseController', () => {
  let mockMediator: IMediator
  let controller: TestController

  beforeEach(() => {
    mockMediator = { send: vi.fn(), query: vi.fn() }
    controller = new TestController(mockMediator)
  })

  it('should initialize with mediator', () => {
    expect(controller).toBeDefined()
    expect(controller.getMediator()).toBe(mockMediator)
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
      code: PIPELINE_ERROR_CODES.VALIDATION_ERROR,
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
})
