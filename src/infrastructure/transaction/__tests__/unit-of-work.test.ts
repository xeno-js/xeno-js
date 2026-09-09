import { describe, expect, it, vi } from 'vitest'

import { UnitOfWork } from '../unit-of-work'

interface State {
  state: unknown
}

interface Context {
  transaction: (callback: (tx: unknown) => Promise<unknown>) => Promise<unknown>
}

const createUnitOfWork = (state: State, transaction: Context['transaction']) =>
  new UnitOfWork({ transaction } as never, state as never)

describe('UnitOfWork', () => {
  describe('runInTransaction', () => {
    it('runs the callback and clears the transaction state', async () => {
      const state: State = { state: null }
      const transactionValue = { id: 'tx-1' }
      const callback = vi.fn(async () => {
        expect(state.state).toBe(transactionValue)
        return 'result'
      })
      const transaction = vi.fn<Context['transaction']>(async (handler) =>
        handler(transactionValue),
      )

      await expect(
        createUnitOfWork(state, transaction).runInTransaction(callback, undefined),
      ).resolves.toBe('result')
      expect(transaction).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledOnce()
      expect(state.state).toBeNull()
    })

    it('clears the state when the callback fails', async () => {
      const state: State = { state: null }
      const failure = new Error('callback failed')
      const transaction = vi.fn<Context['transaction']>(async (handler) => handler({ id: 'tx-1' }))

      await expect(
        createUnitOfWork(state, transaction).runInTransaction(
          async () => Promise.reject(failure),
          undefined,
        ),
      ).rejects.toBe(failure)
      expect(state.state).toBeNull()
    })

    it('rejects an aborted signal before starting a transaction', async () => {
      const state: State = { state: null }
      const transaction = vi.fn<Context['transaction']>(async () => 'unexpected')
      const controller = new AbortController()
      controller.abort()

      await expect(
        createUnitOfWork(state, transaction).runInTransaction(
          async () => 'result',
          controller.signal,
        ),
      ).rejects.toThrow()
      expect(transaction).not.toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('rolls back and clears an active transaction', async () => {
      const rollback = vi.fn(async () => undefined)
      const state: State = { state: { rollback } }

      await createUnitOfWork(state, vi.fn()).dispose()

      expect(rollback).toHaveBeenCalledOnce()
      expect(state.state).toBeNull()
    })

    it('clears an active state without rollback when unavailable', async () => {
      const state: State = { state: { id: 'tx-1' } }

      await createUnitOfWork(state, vi.fn()).dispose()

      expect(state.state).toBeNull()
    })

    it('does nothing when no transaction is active', async () => {
      const state: State = { state: null }

      await expect(createUnitOfWork(state, vi.fn()).dispose()).resolves.toBeUndefined()
      expect(state.state).toBeNull()
    })

    it('clears the state and rethrows when rollback fails', async () => {
      const failure = new Error('rollback failed')
      const rollback = vi.fn(async () => Promise.reject(failure))
      const state: State = { state: { rollback } }

      await expect(createUnitOfWork(state, vi.fn()).dispose()).rejects.toBe(failure)
      expect(rollback).toHaveBeenCalledOnce()
      expect(state.state).toBeNull()
    })
  })
})
