import type { HttpHeaders, HttpMethod, IMiddleware, ResponseDto } from '@xeno-js/shared'

export class CompositeMiddleware implements IMiddleware<HttpHeaders> {
  constructor(private readonly _middlewares: IMiddleware<HttpHeaders>[]) {}

  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    let currentNext = next

    for (let i = this._middlewares.length - 1; i >= 0; i--) {
      const currentBehavior = this._middlewares[i]
      const previousNext = currentNext
      currentNext = () => currentBehavior.execute(req, headers, previousNext)
    }

    return currentNext()
  }
}
