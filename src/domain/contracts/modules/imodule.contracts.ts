import type { Optional } from '@xeno-js/shared'

import type { IServiceContainer } from '@/domain'

import type { ApplicationRegistry } from '../../registries'

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Represents a module that can be registered with the service container.
 *
 * @template TOptions - The type of configuration options for the module.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IModule<
  TRegistry extends ApplicationRegistry<unknown> = ApplicationRegistry<unknown>,
  TOptions = unknown,
> {
  /**
   * @description Configures the module with the provided options.
   *
   * @param container - The service container to register services with.
   * @param opts - The configuration options for the module.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  configure(container: IServiceContainer<TRegistry>, opts?: Optional<TOptions>): Promise<void>
}
