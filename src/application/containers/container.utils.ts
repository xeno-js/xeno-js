import type { ResponseDto } from '@xeno-js/shared'
import { Guards, TOKENS } from '@xeno-js/shared'

import type { ApplicationRegistry, IServiceContainer, IServiceScope } from '@/domain'

/**
 * Utils that provide utility functions for interacting with the service container and managing scoped service resolution.
 */
export const ContainerUtils = Object.freeze({
  /**
   * Resolves a scoped service from the container using the provided token.
   * @param token * The token to resolve from the registry.
   * @param container * The container to resolve the service from.
   *
   * @returns The resolved service instance.
   * @throws Error if the active service scope is not available.
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

  /**
   * Executes a service action within the context of a scoped service.
   * @param res * The response DTO to be returned.
   * @param req * The request DTO to be passed to the action.
   * @param container * The container to resolve the service from.
   * @param action * The action to execute within the scoped service.
   *
   * @returns Promise<ResponseDto<TResponse>> A promise that resolves to the response DTO of the executed action.
   * @throws Error If the active service scope is not available.
   * @throws Error If the service is not found in the container.
   * @throws Error If the service is not a scoped service.
   */
  async runExecute<TResponse, T extends ApplicationRegistry, TRes, TReq>(
    res: TRes,
    req: TReq,
    container: IServiceContainer<T>,
    action: () => Promise<ResponseDto<TResponse>>,
  ): Promise<ResponseDto<TResponse>> {
    const adapter = container.resolve('HTTP_ADAPTER')
    const { request, response } = adapter.adapt(req, res)
    const middleware = container.resolve(TOKENS.MIDDLEWARE)
    return await middleware.execute(request, response, async () => {
      return await action()
    })
  },
})
