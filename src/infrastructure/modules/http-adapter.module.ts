import { Guards } from '@xeno-js/shared'

import type { HttpAdapterConfig, IHttpAdapter, IModule, IServiceContainer } from '@/domain'

import type { XenoRegistry } from '../xeno-registry'

export class HttpAdapterModule<TRegistry extends XenoRegistry = XenoRegistry> implements IModule<
  TRegistry,
  HttpAdapterConfig
> {
  async configure(container: IServiceContainer<TRegistry>, opts: HttpAdapterConfig): Promise<void> {
    const adapter = await this._getAdapter(opts)
    container.addSingleton('HTTP_ADAPTER', () => adapter)
  }

  private async _getAdapter(opts: HttpAdapterConfig): Promise<IHttpAdapter<unknown, unknown>> {
    if (opts.vercel) {
      const { VercelHttpAdapter } = await import('../http')
      return new VercelHttpAdapter()
    } else if (opts.fastify) {
      const { FastifyHttpAdapter } = await import('../http')
      return new FastifyHttpAdapter()
    } else if (Guards.isDefined(opts.custom)) {
      return opts.custom()
    } else {
      const { NativeHttpAdapter } = await import('../http')
      return new NativeHttpAdapter()
    }
  }
}
