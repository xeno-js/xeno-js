import type { Optional } from '@/shared'

import type { IServiceContainer } from '../container/iservice-container.contracts'

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Represents a module that can be registered with the service container.
 *
 * @template TOptions - The type of configuration options for the module.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface IModule<TOptions = unknown> {
  /**
   * @description Configures the module with the provided options.
   *
   * @param container - The service container to register services with.
   * @param opts - The configuration options for the module.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  configure(container: IServiceContainer, opts?: Optional<TOptions>): Promise<void>
}
