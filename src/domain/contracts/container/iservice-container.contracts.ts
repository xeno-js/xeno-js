import type { Factory, IDisposable } from '@xeno-js/shared'

import type { ApplicationRegistry } from '../../registries'
import type { IServiceScope } from './iservice-scope.contracts'

/**
 * @fileoverview Defines the IServiceContainer interface for a dependency injection container.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IServiceProvider<
  Registry extends ApplicationRegistry<unknown> = ApplicationRegistry<unknown>,
> {
  /**
   * Resolves and returns the service registered under the given token.
   * Scoped services can only be resolved through a scope;
   * resolving them directly from the root container throws an error.
   *
   * @param token - The injection token identifying the service to resolve.
   * @returns The resolved service instance of type `T`.
   * @throws An error if no registration is found for the given token.
   * @throws An error if the scope has already been disposed.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  resolve<K extends keyof Registry>(token: K): Registry[K]
}

/**
 * @description Agnostic contract for a dependency injection container that mimics
 * the .NET ServiceCollection builder pattern.
 *
 * Each registration method returns `this` to enable a fluent builder chain.
 * Dependencies are expressed as an ordered array of injection tokens
 * that the container will resolve and inject into the constructor.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IServiceContainer<
  Registry extends ApplicationRegistry<unknown> = ApplicationRegistry<unknown>,
>
  extends IServiceProvider<Registry>, IDisposable {
  /**
   * Registers an implementation under the given token with **singleton** lifetime.
   * A single instance is created on first resolution and reused for every
   * subsequent call within the container's lifetime.
   *
   * @param token - The unique injection token that identifies this service binding.
   * @param factory - Factory function that creates the service instance, receiving the scope as an argument.
   * @returns The container instance to allow method chaining.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  addSingleton<K extends keyof Registry>(
    token: K,
    factory: Factory<Registry[K], [IServiceScope<Registry>]>,
  ): this

  /**
   * Registers an implementation under the given token with **transient** lifetime.
   * A new instance is created on every call to {@link resolve}.
   *
   * @param token - The unique injection token that identifies this service binding.
   * @param factory - Factory function that creates the service instance, receiving the scope as an argument.
   * @returns The container instance to allow method chaining.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  addTransient<K extends keyof Registry>(
    token: K,
    factory: Factory<Registry[K], [IServiceScope<Registry>]>,
  ): this

  /**
   * Registers an implementation under the given token with **scoped** lifetime.
   * One instance is created per logical scope (e.g. per HTTP request).
   * Scoped services must be resolved through an {@link IServiceScope} obtained
   * via {@link createScope}; resolving them directly from the root container throws.
   *
   * @param token - The unique injection token that identifies this service binding.
   * @param factory - Factory function that creates the service instance, receiving the scope as an argument.
   * @returns The container instance to allow method chaining.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  addScoped<K extends keyof Registry>(
    token: K,
    factory: Factory<Registry[K], [IServiceScope<Registry>]>,
  ): this

  /**
   * Creates a new {@link IServiceScope}.
   *
   * The returned scope shares singleton instances with the root container
   * and maintains its own isolated cache for scoped services.
   * Call {@link IServiceScope.dispose} when the scope is no longer needed.
   *
   * @returns A new scope instance.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  createScope(): IServiceScope<Registry>
}
