import {
  Guards,
  type HttpHeaders,
  type HttpMethod,
  type IController,
  type Optional,
  type ResponseDto,
  TOKENS,
} from '@xeno-js/shared'

import type { ApplicationRegistry, IServiceContainer, IServiceScope } from '@/domain'

export const ContainerUtils = Object.freeze({
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

  async runExecute<
    TResponse,
    K extends keyof T,
    T extends ApplicationRegistry,
    TRes,
    TReq,
    TRequest,
    TController extends IController<TRequest, TResponse>,
  >(
    endpoint: string,
    method: Optional<string>,
    headers: HttpHeaders,
    transport: { res: TRes; req: TReq },
    container: IServiceContainer<T>,
    token: K,
    payload: TRequest,
  ): Promise<ResponseDto<TResponse>> {
    const middleware = container.resolve(TOKENS.MIDDLEWARE)

    return await middleware.execute(
      { path: endpoint, method: (method as HttpMethod) ?? 'GET', transport },
      { ...headers },
      async () => {
        const controller = ContainerUtils.resolveServiceScoped(token, container) as TController
        return await controller.handle(payload)
      },
    )
  },
})
