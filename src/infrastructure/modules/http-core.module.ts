import type { IModule, IServiceContainer } from '@/domain'

import type { HttpCoreConfig } from './config/http.config'

/**
 * @description HttpCoreModule is responsible for configuring the core HTTP functionalities of the application. It implements the IModule interface, allowing it to be integrated into the application's dependency injection system. The configure method registers essential services such as the HTTP client and resilience features based on the provided configuration options. This design promotes modularity and allows for easy management of HTTP-related operations throughout the application.
 */
export class HttpCoreModule implements IModule<HttpCoreConfig> {
  async configure(container: IServiceContainer, opts: HttpCoreConfig): Promise<void> {
    const { INJECTION_TOKENS } = await import('../di/injection-tokens.constants')

    const { HttpUtils } = await import('../modules/utils/http.utils')
    await HttpUtils.addAxios(container, opts.http)
    await HttpUtils.addResilience(container, opts.resilience)

    const { RemoteDataSource } = await import('../datasources/remote.datasource')
    container.addSingleton(opts.dataSourceToken, RemoteDataSource, [
      opts.http.token,
      INJECTION_TOKENS.RESILIENCE_CLIENT,
    ])
  }
}
