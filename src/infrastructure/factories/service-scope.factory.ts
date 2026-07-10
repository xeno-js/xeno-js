import type { IFactory, IServiceContainer, IServiceScope } from '@/domain'

import type { XenoRegistry } from '../xeno-registry'

/**
 * @description Factory class responsible for creating instances of IServiceScope. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the IServiceScope, promoting separation of concerns and allowing for flexibility in managing IServiceScope instances across the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class ServiceScopeFactory<T extends XenoRegistry = XenoRegistry> implements IFactory<
  void,
  IServiceScope<T>
> {
  constructor(private readonly _container: IServiceContainer<T>) {}

  public create(): IServiceScope<T> {
    return this._container.createScope()
  }
}
