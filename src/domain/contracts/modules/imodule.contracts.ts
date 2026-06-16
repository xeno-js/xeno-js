import type { Optional } from '@/shared'

import type { IServiceContainer } from '../container/iservice-container.contracts'

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Represents a module that can be registered with the service container.
 *
 * @template TOptions - The type of configuration options for the module.
 */
export interface IModule<TOptions = unknown> {
  /**
   * @description Configures the module with the provided options.
   *
   * @param container - The service container to register services with.
   * @param options - The configuration options for the module.
   */
  configure(container: IServiceContainer, options: Optional<TOptions>): Promise<void>
}
