import type { Constructor, InjectionToken, Optional } from '@/shared'

import type { IServiceScope } from './iservice-scope.contracts'

/**
 * @fileoverview Defines the IServiceContainer interface for a dependency injection container.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */

/**
 * @description Agnostic contract for a dependency injection container that mimics
 * the .NET ServiceCollection builder pattern.
 *
 * Each registration method returns `this` to enable a fluent builder chain.
 * Dependencies are expressed as an ordered array of injection tokens
 * that the container will resolve and inject into the constructor.

   * 
   * @author Gear5 HH
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface IServiceContainer {
  /**
   * Registers an implementation under the given token with **singleton** lifetime.
   * A single instance is created on first resolution and reused for every
   * subsequent call within the container's lifetime.
   *
   * @param token - The unique injection token that identifies this service binding.
   * @param implementation - The concrete class to instantiate.
   * @param dependencies - Ordered array of injection tokens whose resolved values will be
   *   passed as constructor arguments.
   * @returns The container instance to allow method chaining.
  
   * 
   * @author Gear5 e.e
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addSingleton<T>(
    token: InjectionToken<T>,
    implementation: Constructor<T>,
    dependencies: Optional<readonly InjectionToken<unknown>[]>,
  ): this

  /**
   * Registers an implementation under the given token with **transient** lifetime.
   * A new instance is created on every call to {@link resolve}.
   *
   * @param token - The unique injection token that identifies this service binding.
   * @param implementation - The concrete class to instantiate.
   * @param dependencies - Ordered array of injection tokens whose resolved values will be
   *   passed as constructor arguments.
   * @returns The container instance to allow method chaining.
  
   * 
   * @author Gear5 °§ç
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addTransient<T>(
    token: InjectionToken<T>,
    implementation: Constructor<T>,
    dependencies: Optional<readonly InjectionToken<unknown>[]>,
  ): this

  /**
   * Registers an implementation under the given token with **scoped** lifetime.
   * One instance is created per logical scope (e.g. per HTTP request).
   * Scoped services must be resolved through an {@link IServiceScope} obtained
   * via {@link createScope}; resolving them directly from the root container throws.
   *
   * @param token - The unique injection token that identifies this service binding.
   * @param implementation - The concrete class to instantiate.
   * @param dependencies - Ordered array of injection tokens whose resolved values will be
   *   passed as constructor arguments.
   * @returns The container instance to allow method chaining.
  
   * 
   * @author Gear5 €
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addScoped<T>(
    token: InjectionToken<T>,
    implementation: Constructor<T>,
    dependencies: Optional<readonly InjectionToken<unknown>[]>,
  ): this

  /**
   * Registers a factory function under the given token with **singleton** lifetime.
   * A single instance is created on first resolution and reused for every
   * subsequent call within the container's lifetime.
   *
   * @param token - The unique injection token that identifies this service binding.
   * @param factory - The factory function to create the service instance.
   * @returns The container instance to allow method chaining.
  
   * 
   * @author Gear5 $
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addSingletonFactory<T>(
    token: InjectionToken<T>,
    factory: (container: IServiceContainer) => T,
  ): this

  /**
   * Registers a factory function under the given token with **transient** lifetime.
   * A new instance is created on every call to {@link resolve}.
   *
   * @param token - The unique injection token that identifies this service binding.
   * @param factory - The factory function to create the service instance.
   * @returns The container instance to allow method chaining.
  
   * 
   * @author Gear5 SNOOP DOOOOOG
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addTransientFactory<T>(
    token: InjectionToken<T>,
    factory: (container: IServiceContainer) => T,
  ): this

  /**
   * Registers a factory function under the given token with **scoped** lifetime.
   * One instance is created per logical scope (e.g. per HTTP request).
   * Scoped services must be resolved through an {@link IServiceScope} obtained
   * via {@link createScope}; resolving them directly from the root container throws.
   *
   * @param token - The unique injection token that identifies this service binding.
   * @param factory - The factory function to create the service instance.
   * @returns The container instance to allow method chaining.
  
   * 
   * @author Gear5 ee
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addScopedFactory<T>(token: InjectionToken<T>, factory: (container: IServiceContainer) => T): this

  /**
   * Resolves and returns the service registered under the given token.
   * Scoped services cannot be resolved from the root container; use
   * {@link createScope} instead.
   *
   * @param token - The injection token identifying the service to resolve.
   * @returns The resolved service instance of type `T`.
   * @throws An error if no registration is found for the given token.
   * @throws An error if the token is registered with scoped lifetime.
  
   * 
   * @author Gear5 hehe
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  resolve<T>(token: InjectionToken<T>): T

  /**
   * Creates a new {@link IServiceScope}.
   *
   * The returned scope shares singleton instances with the root container
   * and maintains its own isolated cache for scoped services.
   * Call {@link IServiceScope.dispose} when the scope is no longer needed.
   *
   * @returns A new scope instance.
  
   * 
   * @author Gear5 ,.,
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  createScope(): IServiceScope
}
