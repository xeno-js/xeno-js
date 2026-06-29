import type { IFactory, IServiceContainer, IServiceScope } from '@/domain'

/**
 * @description Factory class responsible for creating instances of IServiceScope. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the IServiceScope, promoting separation of concerns and allowing for flexibility in managing IServiceScope instances across the application.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export class ServiceScopeFactory implements IFactory<void, IServiceScope> {
  constructor(private readonly _container: IServiceContainer) {}

  public create(): IServiceScope {
    return this._container.createScope()
  }
}
