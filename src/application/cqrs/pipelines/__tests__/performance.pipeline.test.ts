import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ILogger, IRequest } from '@/domain'
import { Result } from '@/domain'
import { REQUEST_TYPE } from '@/shared'

import { PerformancePipeline } from '../performance.pipeline'

const createLogger = () => {
  const warnMock = vi.fn()
  const logger: ILogger = {
    info: vi.fn(),
    warn: warnMock,
    error: vi.fn(),
    debug: vi.fn(),
  }
  return { logger, warnMock }
}

const mockRequest: IRequest<{ id: string }> = {
  intent: 'TestIntent',
  type: REQUEST_TYPE.COMMAND,
  payload: { id: 'test-id' },
}

describe('PerformancePipeline', () => {
  describe('constructor', () => {
    it('creates instance with default threshold', () => {
      const { logger } = createLogger()
      expect(() => new PerformancePipeline(logger)).not.toThrow()
    })

    it('creates instance with custom positive threshold', () => {
      const { logger } = createLogger()
      expect(() => new PerformancePipeline(logger, 1000)).not.toThrow()
    })

    it('throws when thresholdMs is 0', () => {
      const { logger } = createLogger()
      expect(() => new PerformancePipeline(logger, 0)).toThrow(
        'Invalid thresholdMs value: 0. It must be a positive integer.',
      )
    })

    it('throws when thresholdMs is negative', () => {
      const { logger } = createLogger()
      expect(() => new PerformancePipeline(logger, -1)).toThrow()
    })
  })

  describe('handle', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('returns result from next() when execution is under threshold', async () => {
      const { logger, warnMock } = createLogger()
      vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(100)
      const pipeline = new PerformancePipeline(logger, 1000)
      const next = vi.fn().mockResolvedValue(Result.ok('value'))

      const result = await pipeline.handle(mockRequest, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toBe('value')
      expect(warnMock).not.toHaveBeenCalled()
    })

    it('logs warning when execution exceeds threshold', async () => {
      const { logger, warnMock } = createLogger()
      vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(600)
      const pipeline = new PerformancePipeline(logger, 500)
      const next = vi.fn().mockResolvedValue(Result.ok('value'))

      await pipeline.handle(mockRequest, next)

      expect(warnMock).toHaveBeenCalledWith(expect.stringContaining('Performance warning'))
      expect(warnMock).toHaveBeenCalledWith(expect.stringContaining(mockRequest.intent))
    })

    it('does not log warning when execution equals threshold exactly', async () => {
      const { logger, warnMock } = createLogger()
      vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(500)
      const pipeline = new PerformancePipeline(logger, 500)
      const next = vi.fn().mockResolvedValue(Result.ok('value'))

      await pipeline.handle(mockRequest, next)

      expect(warnMock).not.toHaveBeenCalled()
    })

    it('returns failed result from next() without warning when under threshold', async () => {
      const { logger, warnMock } = createLogger()
      vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(10)
      const pipeline = new PerformancePipeline(logger, 500)
      const appError = { message: 'err' } as never
      const next = vi.fn().mockResolvedValue(Result.fail(appError))

      const result = await pipeline.handle(mockRequest, next)

      expect(result.isOk()).toBe(false)
      expect(warnMock).not.toHaveBeenCalled()
    })

    it('returns failed result from next() and logs warning when exceeds threshold', async () => {
      const { logger, warnMock } = createLogger()
      vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(600)
      const pipeline = new PerformancePipeline(logger, 500)
      const appError = { message: 'err' } as never
      const next = vi.fn().mockResolvedValue(Result.fail(appError))

      const result = await pipeline.handle(mockRequest, next)

      expect(result.isOk()).toBe(false)
      expect(warnMock).toHaveBeenCalledTimes(1)
    })

    it('rethrows error from next() and still logs warning when exceeds threshold', async () => {
      const { logger, warnMock } = createLogger()
      vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(600)
      const pipeline = new PerformancePipeline(logger, 500)
      const next = vi.fn().mockRejectedValue(new Error('unexpected'))

      await expect(pipeline.handle(mockRequest, next)).rejects.toThrow('unexpected')
      expect(warnMock).toHaveBeenCalledTimes(1)
    })

    it('rethrows error from next() without warning when under threshold', async () => {
      const { logger, warnMock } = createLogger()
      vi.spyOn(performance, 'now').mockReturnValueOnce(0).mockReturnValueOnce(10)
      const pipeline = new PerformancePipeline(logger, 500)
      const next = vi.fn().mockRejectedValue(new Error('unexpected'))

      await expect(pipeline.handle(mockRequest, next)).rejects.toThrow('unexpected')
      expect(warnMock).not.toHaveBeenCalled()
    })
  })
})
