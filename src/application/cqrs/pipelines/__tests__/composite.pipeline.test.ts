import type { Delegate, IPipelineBehavior, IRequest, ResultType } from '@xeno-js/shared'
import { Result } from '@xeno-js/shared'
import { REQUEST_TYPE } from '@xeno-js/shared'
import { describe, expect, it, vi } from 'vitest'

import { CompositePipeline } from '../composite.pipeline'

const mockRequest: IRequest<string> = {
  intent: 'TestIntent',
  type: REQUEST_TYPE.COMMAND,
}

const makeResult = (value: string) => Result.ok(value) as ResultType<string>

describe('CompositePipeline', () => {
  describe('constructor', () => {
    it('creates instance with no pipelines', () => {
      expect(() => new CompositePipeline()).not.toThrow()
    })

    it('creates instance with empty array', () => {
      expect(() => new CompositePipeline([])).not.toThrow()
    })

    it('creates instance with provided pipelines', () => {
      const behavior: IPipelineBehavior<IRequest<string>, string> = {
        handle: vi.fn(),
      }
      expect(() => new CompositePipeline([behavior])).not.toThrow()
    })
  })

  describe('handle', () => {
    it('calls next directly when no pipelines', async () => {
      const pipeline = new CompositePipeline<IRequest<string>, string>()
      const next = vi.fn().mockResolvedValue(makeResult('value'))
      const result = await pipeline.handle(mockRequest, next)
      expect(next).toHaveBeenCalledOnce()
      expect(result.isOk()).toBe(true)
      expect(result.getValueOrThrow()).toBe('value')
    })

    it('executes single behavior wrapping next', async () => {
      const callOrder: string[] = []
      const handleSpy = vi.fn(async (_req: IRequest<string>, n: Delegate<string>) => {
        callOrder.push('behavior')
        return n()
      })
      const behavior: IPipelineBehavior<IRequest<string>, string> = { handle: handleSpy }
      const pipeline = new CompositePipeline<IRequest<string>, string>([behavior])
      const next = vi.fn().mockImplementation(() => {
        callOrder.push('next')
        return Promise.resolve(makeResult('done'))
      })

      const result = await pipeline.handle(mockRequest, next)

      expect(callOrder).toEqual(['behavior', 'next'])
      expect(result.getValueOrThrow()).toBe('done')
    })

    it('executes multiple behaviors in correct order (first to last)', async () => {
      const callOrder: string[] = []

      const makeBehavior = (label: string): IPipelineBehavior<IRequest<string>, string> => ({
        handle: vi.fn(async (_req: IRequest<string>, n: Delegate<string>) => {
          callOrder.push(label)
          return n()
        }),
      })

      const b1 = makeBehavior('b1')
      const b2 = makeBehavior('b2')
      const b3 = makeBehavior('b3')

      const pipeline = new CompositePipeline<IRequest<string>, string>([b1, b2, b3])
      const next = vi.fn().mockImplementation(() => {
        callOrder.push('final')
        return Promise.resolve(makeResult('ok'))
      })

      const result = await pipeline.handle(mockRequest, next)

      expect(callOrder).toEqual(['b1', 'b2', 'b3', 'final'])
      expect(result.getValueOrThrow()).toBe('ok')
    })

    it('passes request to each behavior', async () => {
      const b1Handle = vi.fn((_req: IRequest<string>, n: Delegate<string>) => n())
      const b2Handle = vi.fn((_req: IRequest<string>, n: Delegate<string>) => n())
      const b1: IPipelineBehavior<IRequest<string>, string> = { handle: b1Handle }
      const b2: IPipelineBehavior<IRequest<string>, string> = { handle: b2Handle }

      const pipeline = new CompositePipeline<IRequest<string>, string>([b1, b2])
      const next = vi.fn().mockResolvedValue(makeResult('x'))

      await pipeline.handle(mockRequest, next)

      expect(b1Handle).toHaveBeenCalledWith(mockRequest, expect.any(Function))
      expect(b2Handle).toHaveBeenCalledWith(mockRequest, expect.any(Function))
    })

    it('short-circuits when a behavior returns failure without calling next', async () => {
      const failResult = Result.fail({ message: 'blocked' } as never) as ResultType<string>
      const b1Handle = vi.fn().mockResolvedValue(failResult)
      const b2Handle = vi.fn((_req: IRequest<string>, n: Delegate<string>) => n())
      const b1: IPipelineBehavior<IRequest<string>, string> = { handle: b1Handle }
      const b2: IPipelineBehavior<IRequest<string>, string> = { handle: b2Handle }

      const pipeline = new CompositePipeline<IRequest<string>, string>([b1, b2])
      const next = vi.fn().mockResolvedValue(makeResult('never'))

      const result = await pipeline.handle(mockRequest, next)

      expect(result.isOk()).toBe(false)
      expect(b2Handle).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('propagates thrown errors from a behavior', async () => {
      const b1Handle = vi.fn().mockRejectedValue(new Error('boom'))
      const b1: IPipelineBehavior<IRequest<string>, string> = { handle: b1Handle }

      const pipeline = new CompositePipeline<IRequest<string>, string>([b1])
      const next = vi.fn()

      await expect(pipeline.handle(mockRequest, next)).rejects.toThrow('boom')
    })

    it('returns result from next when behavior delegates', async () => {
      const expected = makeResult('delegated')
      const b1Handle = vi.fn((_req: IRequest<string>, n: Delegate<string>) => n())
      const b1: IPipelineBehavior<IRequest<string>, string> = { handle: b1Handle }

      const pipeline = new CompositePipeline<IRequest<string>, string>([b1])
      const next = vi.fn().mockResolvedValue(expected)

      const result = await pipeline.handle(mockRequest, next)
      expect(result).toBe(expected)
    })
  })
})
