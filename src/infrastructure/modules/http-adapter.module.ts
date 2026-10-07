import { Guards } from '@xeno-js/shared'

import type {
  ApplicationRegistry,
  HttpAdapterConfig,
  IHttpAdapter,
  IModule,
  IServiceContainer,
} from '@/domain'

export class HttpAdapterModule<
  TRegistry extends ApplicationRegistry = ApplicationRegistry,
> implements IModule<TRegistry, HttpAdapterConfig> {
  async configure(container: IServiceContainer<TRegistry>, opts: HttpAdapterConfig): Promise<void> {
    const adapter = await this._getAdapter(opts)
    container.addSingleton('HTTP_ADAPTER', () => adapter)
  }

  private async _getAdapter(opts: HttpAdapterConfig): Promise<IHttpAdapter<unknown, unknown>> {
    if (opts.vercel) {
      const { VercelHttpAdapter } = await import('../http/vercel.http-adapter')
      return new VercelHttpAdapter()
    } else if (opts.fastify) {
      const { FastifyHttpAdapter } = await import('../http/fastify.http-adapter')
      return new FastifyHttpAdapter()
    } else if (Guards.isDefined(opts.custom)) {
      return opts.custom()
    } else {
      const { NativeHttpAdapter } = await import('../http/native.http-adapter')
      return new NativeHttpAdapter()
    }
  }
}
