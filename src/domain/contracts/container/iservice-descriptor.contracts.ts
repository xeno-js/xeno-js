import type { ApplicationRegistry } from '../../registries'
import type { IServiceProvider } from './iservice-container.contracts'

/**
 * @fileoverview Defines the ServiceDescriptor type for service registrations.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */

/**
 * @description The possible lifetimes for a service registration, determining
 * how instances are managed and cached by the container.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Lifetime = 'singleton' | 'transient' | 'scoped'

/**
 * @description Describes a service registration in the container, including
 * the implementation constructor, its dependencies, and its lifetime.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface ServiceDescriptor<
  T,
  TRegistry extends ApplicationRegistry<unknown> = ApplicationRegistry<unknown>,
> {
  /**
   * @description The injection token that uniquely identifies this service registration.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly token: keyof TRegistry
  /**
   * @description The lifetime of the service, determining how instances are
   * managed and cached by the container.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly lifetime: Lifetime
  /**
   * @description Factory function to create the service instance.
   * This factory will be used instead of the constructor.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly factory: (container: IServiceProvider<TRegistry>) => T
}
