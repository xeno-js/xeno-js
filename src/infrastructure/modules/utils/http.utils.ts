import type { IServiceContainer } from '@/domain'

import type { HttpConfig, ResilienceConfig } from '../config'

/**
 * @description Utility functions for configuring HTTP clients and resilience features in the service container.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export const HttpUtils = Object.freeze({
  /**
   * @description Utility function to create a query string from an object of query parameters. It takes an object where the keys are the parameter names and the values are the parameter values, and returns a properly encoded query string that can be appended to a URL for making HTTP requests.
   * @param params - An object containing the query parameters as key-value pairs. The keys represent the parameter names, and the values represent the parameter values.
   * @returns A string representing the encoded query string that can be appended to a URL for making HTTP requests.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addAxios: async (container: IServiceContainer, opts: HttpConfig): Promise<void> => {
    const { AxiosFactory } = await import('@/infrastructure')
    container.addSingletonFactory(opts.token, () => {
      const factory = new AxiosFactory()
      return factory.create(opts.client)
    })
  },
  /**
   * @description Utility function to add resilience features to the service container. It takes a ResilienceConfig object that specifies whether resilience features are enabled and provides the necessary settings for implementing resilience strategies such as retries, circuit breakers, and timeouts. If resilience is enabled, it registers a singleton factory in the service container that creates an instance of the resilience client based on the provided configuration.
   * @param container - The service container to register the resilience client with.
   * @param opts - The ResilienceConfig options that determine whether resilience features are enabled and provide the necessary settings for implementing resilience strategies.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addResilience: async (container: IServiceContainer, opts: ResilienceConfig): Promise<void> => {
    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')

    const { CockatielResilienceFactory } =
      await import('../../factories/cockatiel-resilience.factory')
    container.addSingletonFactory(INJECTION_TOKENS.RESILIENCE_CLIENT, () => {
      const factory = new CockatielResilienceFactory()
      return factory.create(opts)
    })
  },
} as const)
