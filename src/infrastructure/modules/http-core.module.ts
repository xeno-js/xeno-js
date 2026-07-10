import type { HttpCoreConfig, IHttpClient, IModule, IServiceContainer } from '@/domain'

import type { XenoRegistry } from '../xeno-registry'

/**
 * @description HttpCoreModule is responsible for configuring the core HTTP functionalities of the application. It implements the IModule interface, allowing it to be integrated into the application's dependency injection system. The configure method registers essential services such as the HTTP client and resilience features based on the provided configuration options. This design promotes modularity and allows for easy management of HTTP-related operations throughout the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class HttpCoreModule<TRegistry extends XenoRegistry = XenoRegistry> implements IModule<
  TRegistry,
  HttpCoreConfig<TRegistry>
> {
  async configure(
    container: IServiceContainer<TRegistry>,
    opts: HttpCoreConfig<TRegistry>,
  ): Promise<void> {
    const { TOKENS } = await import('@/shared')
    const { HttpUtils } = await import('./utils/http.utils')
    await HttpUtils.addAxios(container, opts.http)
    await HttpUtils.addResilience(container, opts.resilience)

    const { Guards } = await import('@/shared')
    const { RemoteDataSource } = await import('../datasources/remote.datasource')
    container.addSingleton(opts.dataSourceToken, (c) => {
      const httpClient = c.resolve(opts.http.token)
      if (!Guards.isDefined(httpClient)) {
        throw new Error(
          `HTTP client for token ${opts.http.token.toString()} is not defined in the container.`,
        )
      }
      if (
        !Guards.hasMethod(httpClient, 'get') ||
        !Guards.hasMethod(httpClient, 'post') ||
        !Guards.hasMethod(httpClient, 'put') ||
        !Guards.hasMethod(httpClient, 'patch') ||
        !Guards.hasMethod(httpClient, 'delete')
      ) {
        throw new Error(
          'The resolved HTTP client instance does not implement the required methods of IHttpClient.',
        )
      }
      const resilience = c.resolve(TOKENS.RESILIENCE_CLIENT)
      return new RemoteDataSource(
        httpClient as IHttpClient,
        resilience,
      ) as TRegistry[typeof opts.dataSourceToken]
    })
  }
}
