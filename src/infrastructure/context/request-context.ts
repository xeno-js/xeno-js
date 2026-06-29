import type { AsyncLocalStorage } from 'node:async_hooks'

import type { IRequestContext } from '@/domain'
import type { Optional } from '@/shared'
import { Guards } from '@/shared'

/**
 * @description The NodeRequestContext class is an implementation of the IRequestContext interface that utilizes Node.js's AsyncLocalStorage to manage and access request-specific context data, such as user identity information, across asynchronous operations. This class provides methods to run asynchronous functions within a specific context and to retrieve the current identity information from the context when needed. By leveraging AsyncLocalStorage, the NodeRequestContext ensures that the context data is properly propagated across asynchronous calls, allowing for seamless access to identity information throughout the execution flow of a request.
 * @template TCtx - The type of the context data that will be stored and accessed using this request context implementation. This typically includes user identity information, such as user ID, roles, and correlation ID, which can be used for authentication and authorization purposes within the application.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export class NodeRequestContext<TCtx> implements IRequestContext<TCtx> {
  /**
   * @description Constructs a new instance of the NodeRequestContext class, which requires an instance of AsyncLocalStorage to manage the request context. The AsyncLocalStorage instance is used to create and access the context for each request, allowing for the storage of identity information and other relevant data that needs to be accessible across asynchronous operations. This constructor initializes the NodeRequestContext with the provided AsyncLocalStorage, enabling it to implement the methods defined in the IRequestContext interface for managing request-specific context data.
   * @param _storage An instance of AsyncLocalStorage that is used to manage the request context, allowing for the storage and retrieval of identity information and other relevant data across asynchronous operations.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  constructor(private readonly _storage: AsyncLocalStorage<TCtx>) {}

  public async runAsync<T>(context: TCtx, fn: () => Promise<T>): Promise<T> {
    return this._storage.run(context, fn)
  }

  public getContext(): Optional<TCtx> {
    const store = this._storage.getStore()
    if (!Guards.isDefined(store)) return undefined
    return Object.freeze({ ...store })
  }
}
