import type { ILogger, IRequest } from '@xeno-js/shared'
import { AppError, Result } from '@xeno-js/shared'
import { REQUEST_TYPE, STATUS_CODES } from '@xeno-js/shared'
import { describe, expect, it, vi } from 'vitest'

import { LoggingPipeline } from '../logging.pipeline'

const createLogger = () => {
  const infoMock = vi.fn()
  const warnMock = vi.fn()
  const errorMock = vi.fn()
  const debugMock = vi.fn()
  const logger: ILogger = {
    info: infoMock,
    warn: warnMock,
    error: errorMock,
    debug: debugMock,
  }
  return { logger, infoMock, warnMock, errorMock, debugMock }
}

const mockRequest: IRequest<{ id: string }> = {
  intent: 'TestIntent',
  type: REQUEST_TYPE.COMMAND,
}

describe('LoggingPipeline', () => {
  it('logs info before and after a successful next() call and returns the result', async () => {
    const { logger, infoMock, errorMock } = createLogger()
    const pipeline = new LoggingPipeline(logger)
    const next = vi.fn().mockResolvedValue(Result.ok('ok'))

    const result = await pipeline.handle(mockRequest, next)

    expect(infoMock).toHaveBeenNthCalledWith(
      1,
      `Handling ${mockRequest.type} ${mockRequest.intent}`,
    )
    expect(next).toHaveBeenCalledTimes(1)
    expect(infoMock).toHaveBeenNthCalledWith(
      2,
      `Successfully handled ${mockRequest.type} ${mockRequest.intent}`,
    )
    expect(errorMock).not.toHaveBeenCalled()
    expect(result.isOk()).toBe(true)
    expect(result.getValueOrThrow()).toBe('ok')
  })

  it('logs info before and error after a failed next() call and returns the failed result', async () => {
    const { logger, infoMock, errorMock } = createLogger()
    const pipeline = new LoggingPipeline(logger)
    const appError = AppError.create({
      code: 'TEST_ERROR',
      message: 'something went wrong',
      status: STATUS_CODES.BAD_REQUEST,
      name: mockRequest.intent,
      cause: new Error('test'),
    })
    const next = vi.fn().mockResolvedValue(Result.fail(appError))

    const result = await pipeline.handle(mockRequest, next)

    expect(infoMock).toHaveBeenCalledTimes(1)
    expect(infoMock).toHaveBeenCalledWith(`Handling ${mockRequest.type} ${mockRequest.intent}`)
    expect(next).toHaveBeenCalledTimes(1)
    expect(errorMock).toHaveBeenCalledTimes(1)
    expect(errorMock).toHaveBeenCalledWith(
      `Failed to handle ${mockRequest.type} ${mockRequest.intent}: ${appError.message}`,
      appError,
    )
    expect(result.isOk()).toBe(false)
    expect(result.getErrorOrThrow()).toBe(appError)
  })
})
