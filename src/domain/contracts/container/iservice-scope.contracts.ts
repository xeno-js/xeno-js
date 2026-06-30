import type { InjectionToken } from '@/shared'

/**
 * @fileoverview Defines the IServiceScope interface for scoped dependency injection.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
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
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export interface IServiceScope {
  /**
   * Resolves the service registered under the given token within this scope.
   *
   * - **Scoped** services: one instance per scope, cached for the scope lifetime.
   * - **Singleton** and **transient** services: delegated to the root container.
   *
   * @param token - The injection token identifying the service to resolve.
   * @returns The resolved service instance of type `T`.
   * @throws An error if no registration is found for the given token.
   * @throws An error if the scope has already been disposed.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  resolve<T>(token: InjectionToken<T>): T

  /**
   * Disposes the scope by clearing all cached scoped instances and
   * marking the scope as no longer usable.
   *
   * Any subsequent call to {@link resolve} on a disposed scope will throw.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  dispose(): void
}
