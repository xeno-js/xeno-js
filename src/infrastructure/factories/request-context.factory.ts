import { AsyncLocalStorage } from 'node:async_hooks'

import type { IFactory, IRequestContext } from '@/domain'

import { NodeRequestContext } from '../context/request-context'

/**
 * @description Factory class responsible for creating instances of NodeRequestContext. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the NodeRequestContext, promoting separation of concerns and flexibility in managing request context instances across the application.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export class NodeRequestContextFactory<TCtx> implements IFactory<void, IRequestContext<TCtx>> {
  public create(): IRequestContext<TCtx> {
    const store = new AsyncLocalStorage<TCtx>()
    return new NodeRequestContext<TCtx>(store)
  }
}
