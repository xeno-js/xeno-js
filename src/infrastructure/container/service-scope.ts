import type { IServiceContainer, IServiceScope, ServiceDescriptor } from '@/domain'
import { Guards, type InjectionToken } from '@/shared'

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Concrete implementation of {@link IServiceScope}.
 *
 * Created by {@link ServiceContainer.createScope}. Maintains its own isolated
 * instance cache for scoped services. Singleton and transient services are
 * resolved by delegating to the root container resolver.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class ServiceScope implements IServiceScope {
  private readonly _scopedInstances = new Map<symbol, unknown>()
  private _disposed = false

  /**
   * @param _descriptors - The full registration map from the root container.
   * @param _rootResolve - Delegate to the root container's resolve method for
   *   singleton and transient services.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public constructor(
    private readonly _descriptors: ReadonlyMap<symbol, ServiceDescriptor<unknown>>,
    private readonly _rootResolve: IServiceContainer,
  ) {}

  /**
   * @inheritdoc
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public resolve<T>(token: InjectionToken<T>): T {
    if (this._disposed) {
      throw new Error('Cannot resolve from a disposed scope.')
    }

    const descriptor = this._descriptors.get(token.symbol)

    if (!Guards.isDefined(descriptor)) {
      throw new Error(`No registration found for token: ${token.symbol.toString()}`)
    }

    if (descriptor.lifetime !== 'scoped') {
      return this._rootResolve.resolve(token)
    }

    if (this._scopedInstances.has(token.symbol)) {
      return this._scopedInstances.get(token.symbol) as T
    }

    if (Guards.isDefined(descriptor.factory)) {
      const instance = descriptor.factory(this)
      this._scopedInstances.set(token.symbol, instance)
      return instance as T
    } else if (
      Guards.isDefined(descriptor.implementation) &&
      Guards.isDefined(descriptor.dependencies)
    ) {
      const deps = (descriptor.dependencies ?? []).map((depToken) => this.resolve(depToken))
      const instance = new descriptor.implementation(...deps)
      this._scopedInstances.set(token.symbol, instance)
      return instance as T
    }
    throw new Error(`Cannot instantiate service for token: ${token.symbol.toString()}`)
  }

  /**
   * @inheritdoc
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public dispose(): void {
    this._scopedInstances.clear()
    this._disposed = true
  }
}
