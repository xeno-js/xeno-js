import type { HttpConfig, IServiceContainer, ResilienceConfig } from '@/domain'

import type { XenoRegistry } from '../../xeno-registry'

/**
 * @description Utility functions for configuring HTTP clients and resilience features in the service container.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const HttpUtils = Object.freeze({
  /**
   * @description Utility function to create a query string from an object of query parameters. It takes an object where the keys are the parameter names and the values are the parameter values, and returns a properly encoded query string that can be appended to a URL for making HTTP requests.
   * @param params - An object containing the query parameters as key-value pairs. The keys represent the parameter names, and the values represent the parameter values.
   * @returns A string representing the encoded query string that can be appended to a URL for making HTTP requests.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  async addAxios<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: HttpConfig<TRegistry>,
  ): Promise<void> {
    const { NodeAxiosFactory } = await import('../../factories')
    const { Guards } = await import('@xeno-js/shared')
    if (!Guards.isDefined(opts.token)) {
      throw new Error('HttpConfig.token is required and must be defined.')
    }

    container.addSingleton(opts.token, () => {
      const factory = new NodeAxiosFactory()
      const instance = factory.create(opts.client)
      if (
        !Guards.hasMethod(instance, 'get') ||
        !Guards.hasMethod(instance, 'post') ||
        !Guards.hasMethod(instance, 'put') ||
        !Guards.hasMethod(instance, 'patch') ||
        !Guards.hasMethod(instance, 'delete')
      ) {
        throw new Error(
          'The created HTTP client instance does not implement the required methods of IHttpClient.',
        )
      }
      return instance as unknown as TRegistry[typeof opts.token]
    })
  },
  /**
   * @description Utility function to add resilience features to the service container. It takes a ResilienceConfig object that specifies whether resilience features are enabled and provides the necessary settings for implementing resilience strategies such as retries, circuit breakers, and timeouts. If resilience is enabled, it registers a singleton factory in the service container that creates an instance of the resilience client based on the provided configuration.
   * @param container - The service container to register the resilience client with.
   * @param opts - The ResilienceConfig options that determine whether resilience features are enabled and provide the necessary settings for implementing resilience strategies.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  async addResilience<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: ResilienceConfig,
  ): Promise<void> {
    const { TOKENS } = await import('@xeno-js/shared')
    const { CockatielResilienceFactory } = await import('../../factories')
    container.addSingleton(TOKENS.RESILIENCE_CLIENT, () => {
      const factory = new CockatielResilienceFactory()
      return factory.create(opts)
    })
  },

  async addAllowOrigin<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: string[],
  ): Promise<void> {
    const { Guards } = await import('@xeno-js/shared')
    if (Guards.isNullOrEmpty(opts)) throw new Error('At least an allow origin must be passed')

    const { TOKENS } = await import('@xeno-js/shared')
    const { AllowOrigin } = await import('@xeno-js/shared')
    const allowOrigin: string[] = []

    opts.forEach((x) => {
      allowOrigin.push(x.trim().toLowerCase())
    })

    container.addSingleton(TOKENS.ALLOW_ORIGIN, () => new AllowOrigin(allowOrigin))
  },
} as const)
