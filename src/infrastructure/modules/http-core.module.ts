import type { HttpCoreConfig, IModule, IServiceContainer } from '@/domain'

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
    const { HttpUtils } = await import('./utils/http.utils')
    await HttpUtils.addAxios(container, opts.http)
    await HttpUtils.addResilience(container, opts.resilience)
  }
}
