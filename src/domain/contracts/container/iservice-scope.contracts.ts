import type { IDisposable } from '@xeno-js/shared'

import type { ApplicationRegistry } from '../../registries'

/**
 * @fileoverview Defines the IServiceScope interface for scoped dependency injection.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */

/**
 * @description Represents a logical scope for resolving scoped services,
 * mimicking the .NET `IServiceScope` pattern.
 *
 * A scope is created by {@link IServiceContainer.createScope} and provides
 * its own isolated instance cache for services registered with scoped lifetime.
 * Singleton and transient services are still resolved through the root container.
 *
 * Call {@link dispose} when the scope is no longer needed to release all
 * scoped instances and invalidate the scope.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IServiceScope<
  Registry extends ApplicationRegistry<unknown> = ApplicationRegistry<unknown>,
> extends IDisposable {
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
