import type { Constructor, InjectionToken, Optional } from '@/shared'

import type { IServiceContainer } from './iservice-container.contracts'

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
export interface ServiceDescriptor<T> {
  /**
   * @description The concrete class to instantiate for this service.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly implementation?: Constructor<T>
  /**
   * @description Ordered array of injection tokens whose resolved values will be passed
   * as constructor arguments when instantiating the service.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly dependencies?: readonly InjectionToken<unknown>[]
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
   * @description Optional factory function to create the service instance.
   * If provided, this factory will be used instead of the constructor.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly factory?: Optional<(container: IServiceContainer) => T>
}
