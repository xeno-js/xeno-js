import type {
  IServiceContainer,
  IServiceProvider,
  IServiceScope,
  ServiceDescriptor,
} from '@/domain'
import type { Constructor, InjectionToken, Optional } from '@/shared'
import { Guards } from '@/shared'

import { INJECTION_TOKENS } from '../di'
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

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class ServiceContainer implements IServiceContainer {
  private readonly _descriptors = new Map<symbol, ServiceDescriptor<unknown>>()
  private readonly _singletons = new Map<symbol, unknown>()

  constructor() {
    this.addSingletonFactory(INJECTION_TOKENS.SERVICE_CONTAINER, () => this)
  }

  /**
   * @inheritdoc
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addSingleton<T>(
    token: InjectionToken<T>,
    implementation: Constructor<T>,
    dependencies?: Optional<readonly InjectionToken<unknown>[]>,
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addTransient<T>(
    token: InjectionToken<T>,
    implementation: Constructor<T>,
    dependencies?: Optional<readonly InjectionToken<unknown>[]>,
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addScoped<T>(
    token: InjectionToken<T>,
    implementation: Constructor<T>,
    dependencies?: Optional<readonly InjectionToken<unknown>[]>,
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addSingletonFactory<T>(
    token: InjectionToken<T>,
    factory: (container: IServiceProvider) => T,
  ): this {
    this._descriptors.set(token.symbol, {
      factory,
      lifetime: 'singleton',
    })
    return this
  }

  /**
   * @inheritdoc
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addScopedFactory<T>(
    token: InjectionToken<T>,
    factory: (container: IServiceProvider) => T,
  ): this {
    this._descriptors.set(token.symbol, {
      factory,
      lifetime: 'scoped',
    })
    return this
  }

  /**
   * @inheritdoc
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public addTransientFactory<T>(
    token: InjectionToken<T>,
    factory: (container: IServiceProvider) => T,
  ): this {
    this._descriptors.set(token.symbol, {
      factory,
      lifetime: 'transient',
    })
    return this
  }

  /**
   * @inheritdoc
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public resolve<T>(token: InjectionToken<T>): T {
    const descriptor = this._descriptors.get(token.symbol)

    if (!Guards.isDefined(descriptor)) {
      throw new Error(`No registration found for token: ${token.symbol.toString()}`)
    }

    if (descriptor.lifetime === 'scoped') {
      throw new Error(
        `Scoped services must be resolved through a scope. Use createScope(). Token: ${token.symbol.toString()}`,
      )
    }

    return this._instantiate(token, descriptor)
  }

  /**
   * @inheritdoc
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public createScope(): IServiceScope {
    return new ServiceScope(this._descriptors, this)
  }

  /**
   * @description Validates that all dependencies for registered services are also registered in the container. Throws an error if any dependency is missing.
   *
   * @throws {Error} If a service has a dependency that is not registered in the container.
   *
   * @example
   * const container = new ServiceContainer();
   * container.addSingleton(MyService);
   * container.validateRegistrations();
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  public validate(): void {
    for (const [symbol, descriptor] of this._descriptors.entries()) {
      if (!Guards.isNullOrEmpty(descriptor.factory)) continue

      const implementation = descriptor.implementation
      if (!Guards.isDefined(implementation)) continue

      let expectedParamCount = implementation.length
      if (expectedParamCount === 0) {
        let proto: unknown = Object.getPrototypeOf(implementation)
        while (
          Guards.isDefined(proto) &&
          proto !== Function.prototype &&
          proto !== Object.prototype
        ) {
          if (Guards.isFunction(proto)) {
            if (proto.length > 0) {
              expectedParamCount = proto.length
              break
            }
            proto = Object.getPrototypeOf(proto)
          }
        }
      }

      const declaredDepCount = descriptor.dependencies?.length ?? 0

      if (declaredDepCount !== expectedParamCount) {
        const serviceName = implementation.name ?? 'UnknownClass'
        const targetTokenName = symbol.toString()

        throw new Error(
          `[IoC Arity Mismatch Error] Constructor arguments mismatch detected!\n` +
            `👉 Service: Class **${serviceName}** registered under Token [${targetTokenName}]\n` +
            `📊 Constructor expects: ${expectedParamCount} parameters\n` +
            `📝 Bootstrap declared: ${declaredDepCount} dependencies\n` +
            `💡 Fix: Update the dependencies array in your bootstrap registration to match the class constructor signature exactly.`,
        )
      }

      // 2. VALIDAZIONE ESISTENZA TOKEN: Controlla che ogni token dichiarato esista nel container
      if (declaredDepCount > 0 && Guards.isDefined(descriptor.dependencies)) {
        for (const depToken of descriptor.dependencies) {
          if (!this._descriptors.has(depToken.symbol)) {
            const serviceName = implementation.name ?? 'UnknownClass'
            const missingTokenName = depToken.symbol.toString()
            const targetTokenName = symbol.toString()

            throw new Error(
              `[IoC Missing Dependency Error] Missing dependency detected!\n` +
                `👉 Service: Class **${serviceName}** registered under Token [${targetTokenName}]\n` +
                `❌ Requires missing Token: [${missingTokenName}]\n` +
                `💡 Fix: Ensure that the missing service is registered in your modules before building the application.`,
            )
          }
        }
      }
    }
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
