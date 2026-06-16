import type { IServiceContainer, IServiceScope, ServiceDescriptor } from '@/domain'
import { type Constructor, Guards, type InjectionToken, type Optional } from '@/shared'

import { ServiceScope } from './service-scope'

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Concrete implementation of {@link IServiceContainer}.
 *
 * Supports three registration lifetimes:
 * - **singleton** — one shared instance per container.
 * - **transient** — a new instance on every {@link resolve} call.
 * - **scoped** — one instance per {@link IServiceScope}; must be resolved
 *   through a scope obtained via {@link createScope}.
 */
export class ServiceContainer implements IServiceContainer {
  private readonly _descriptors = new Map<symbol, ServiceDescriptor<unknown>>()
  private readonly _singletons = new Map<symbol, unknown>()

  /**
   * @inheritdoc
   */
  public addSingleton<T>(
    token: InjectionToken<T>,
    implementation: Constructor<T>,
    dependencies: Optional<readonly InjectionToken<unknown>[]>,
  ): this {
    this._descriptors.set(token.symbol, {
      implementation,
      dependencies: dependencies ?? [],
      lifetime: 'singleton',
    })
    return this
  }

  /**
   * @inheritdoc
   */
  public addTransient<T>(
    token: InjectionToken<T>,
    implementation: Constructor<T>,
    dependencies: Optional<readonly InjectionToken<unknown>[]>,
  ): this {
    this._descriptors.set(token.symbol, {
      implementation,
      dependencies: dependencies ?? [],
      lifetime: 'transient',
    })
    return this
  }

  /**
   * @inheritdoc
   */
  public addScoped<T>(
    token: InjectionToken<T>,
    implementation: Constructor<T>,
    dependencies: Optional<readonly InjectionToken<unknown>[]>,
  ): this {
    this._descriptors.set(token.symbol, {
      implementation,
      dependencies: dependencies ?? [],
      lifetime: 'scoped',
    })
    return this
  }

  /**
   * @inheritdoc
   */
  public addSingletonFactory<T>(
    token: InjectionToken<T>,
    factory: (container: IServiceContainer) => T,
  ): this {
    this._descriptors.set(token.symbol, {
      factory,
      lifetime: 'singleton',
    })
    return this
  }

  /**
   * @inheritdoc
   */
  public addScopedFactory<T>(
    token: InjectionToken<T>,
    factory: (container: IServiceContainer) => T,
  ): this {
    this._descriptors.set(token.symbol, {
      factory,
      lifetime: 'scoped',
    })
    return this
  }

  /**
   * @inheritdoc
   */
  public addTransientFactory<T>(
    token: InjectionToken<T>,
    factory: (container: IServiceContainer) => T,
  ): this {
    this._descriptors.set(token.symbol, {
      factory,
      lifetime: 'transient',
    })
    return this
  }

  /**
   * @inheritdoc
   */
  public resolve<T>(token: InjectionToken<T>): T {
    const descriptor = this._descriptors.get(token.symbol)

    if (!Guards.isDefined(descriptor)) {
      throw new Error(`No registration found for token: ${token.symbol.toString()}`)
    }

    if (descriptor.lifetime === 'scoped') {
      throw new Error('Scoped services must be resolved through a scope. Use createScope().')
    }

    return this._instantiate(token, descriptor)
  }

  /**
   * @inheritdoc
   */
  public createScope(): IServiceScope {
    return new ServiceScope(this._descriptors, this)
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  private _instantiate<T>(token: InjectionToken<T>, descriptor: ServiceDescriptor<unknown>): T {
    if (descriptor.lifetime === 'singleton') {
      if (this._singletons.has(token.symbol)) {
        return this._singletons.get(token.symbol) as T
      }
      const instance = this._create(descriptor)
      this._singletons.set(token.symbol, instance)
      return instance as T
    }

    return this._create(descriptor) as T
  }

  private _create(descriptor: ServiceDescriptor<unknown>): unknown {
    if (descriptor.factory !== undefined && descriptor.factory !== null) {
      return descriptor.factory(this)
    }
    const deps = (descriptor.dependencies ?? []).map((depToken) => this.resolve(depToken))
    return new descriptor.implementation!(...deps)
  }
}
