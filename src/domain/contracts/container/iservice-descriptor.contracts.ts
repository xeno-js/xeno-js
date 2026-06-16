import type { Constructor, InjectionToken, Optional } from '@/shared'

import type { IServiceContainer } from './iservice-container.contracts'

/**
 * @fileoverview Defines the ServiceDescriptor type for service registrations.
 */

/**
 * @description The possible lifetimes for a service registration, determining
 * how instances are managed and cached by the container.
 */
export type Lifetime = 'singleton' | 'transient' | 'scoped'

/**
 * @description Describes a service registration in the container, including
 * the implementation constructor, its dependencies, and its lifetime.
 */
export interface ServiceDescriptor<T> {
  /**
   * @description The concrete class to instantiate for this service.
   */
  readonly implementation?: Constructor<T>
  /**
   * @description Ordered array of injection tokens whose resolved values will be passed
   * as constructor arguments when instantiating the service.
   */
  readonly dependencies?: readonly InjectionToken<unknown>[]
  /**
   * @description The lifetime of the service, determining how instances are
   * managed and cached by the container.
   */
  readonly lifetime: Lifetime
  /**
   * @description Optional factory function to create the service instance.
   * If provided, this factory will be used instead of the constructor.
   */
  readonly factory?: Optional<(container: IServiceContainer) => T>
}
