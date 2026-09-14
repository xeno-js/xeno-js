import { Guards, type HttpMethod } from '@xeno-js/shared'

import type { IAllowMethod } from '@/domain'

export class AllowMethodRegistry implements IAllowMethod {
  private readonly _routes = new Map<string, HttpMethod[]>()

  public add(path: string, methods: HttpMethod[]): void {
    const normalizedPath = path.trim()
    this._routes.set(normalizedPath, methods)
  }

  public check(path: string, method: HttpMethod): boolean {
    const cleanPath = path.split('?')[0].split('#')[0].trim()
    const allowedMethods = this._routes.get(cleanPath)
    if (!Guards.isDefined(allowedMethods)) return false
    return allowedMethods.includes(method)
  }
}
