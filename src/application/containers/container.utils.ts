import {
  Guards,
  type HttpHeaders,
  type HttpMethod,
  type Optional,
  type ResponseDto,
  TOKENS,
} from '@xeno-js/shared'

import type { ApplicationRegistry, IServiceContainer, IServiceScope } from '@/domain'

/**
 * Utils that provide utility functions for interacting with the service container and managing scoped service resolution.
 */
export const ContainerUtils = Object.freeze({
  /**
   * Resolves a scoped service from the container using the provided token.
   * @param token * The token to resolve from the registry.
   * @param container *
   * @returns
   */
  resolveServiceScoped<K extends keyof T, T extends ApplicationRegistry>(
    token: K,
    container: IServiceContainer<T>,
  ) {
    const scope = container.resolve(TOKENS.SERVICE_SCOPE_ACCESSOR).getScope()
    if (!Guards.isDefined(scope)) {
      throw new Error('Active service scope is required to execute Scoped service.')
    }

    const service = (scope as IServiceScope<T>).resolve(token)
    return service
  },

  async runExecute<TResponse, T extends ApplicationRegistry, TRes, TReq>(
    endpoint: string,
    method: Optional<string>,
    headers: HttpHeaders,
    transport: { res: TRes; req: TReq },
    container: IServiceContainer<T>,
    action: () => Promise<ResponseDto<TResponse>>,
  ): Promise<ResponseDto<TResponse>> {
    const middleware = container.resolve(TOKENS.MIDDLEWARE)

    return await middleware.execute(
      { path: endpoint, method: (method as HttpMethod) ?? 'GET', transport },
      { ...headers },
      async () => {
        return await action()
      },
    )
  },
})
