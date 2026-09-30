import type {
  CookieHandlerOptions,
  IConfigurationService,
  ISsrCookie,
  ISsrCookieHandler,
  ISsrCookieToSet,
} from '@xeno-js/core'
import type { INetworkContextAccessor } from '@xeno-js/core'
import { Guards } from '@xeno-js/core'

/**
 *
 */
export class CookieHandler implements ISsrCookieHandler {
  constructor(
    private readonly contextAccessor: INetworkContextAccessor,
    private readonly _config: IConfigurationService,
    private readonly _cookieOpts: CookieHandlerOptions,
  ) {}

  public getAll(): ISsrCookie[] {
    const network = this.contextAccessor.getNetworkContext()
    const req = network?.transport?.req

    if (!Guards.isDefined(req) || Guards.isNullOrEmpty(req.headers.get('cookie'))) return []

    return (
      req.headers
        .get('cookie')
        ?.split(';')
        .map((cookie) => {
          const [name, ...rest] = cookie.split('=')
          return { name: name.trim(), value: rest.join('=') }
        }) ?? []
    )
  }

  public setAll(cookies: ISsrCookieToSet[]): void {
    const network = this.contextAccessor.getNetworkContext()
    const res = network?.transport?.res

    if (!Guards.isDefined(res)) return

    const serializedCookies = cookies.map((c) => this.serialize(c))
    const existingSetCookie = res.headers.getSetCookie()

    res.headers.delete('Set-Cookie')
    for (const cookie of [...existingSetCookie, ...serializedCookies]) {
      res.headers.append('Set-Cookie', cookie)
    }
  }

  private serialize(cookie: ISsrCookieToSet): string {
    const safeName = encodeURIComponent(cookie.name)
    const safeValue = encodeURIComponent(cookie.value)
    let str = `${safeName}=${safeValue}`

    const isProd = this._config.get('NODE_ENV') === 'production'
    const defaultOptions = {
      path: this._cookieOpts.path,
      httpOnly: this._cookieOpts.httpOnly,
      secure: this._cookieOpts.secure ?? isProd,
      sameSite: this._cookieOpts.sameSite ?? 'Lax',
    }

    const opts = { ...defaultOptions, ...(cookie.options ?? {}) }

    str += `; Path=${opts.path}`

    if (Guards.isDefined(opts.maxAge)) str += `; Max-Age=${opts.maxAge}`
    if (Guards.isDefined(opts.domain)) str += `; Domain=${opts.domain}`
    if (Guards.isDefined(opts.sameSite)) str += `; SameSite=${opts.sameSite}`
    if (opts.secure) str += `; Secure`
    if (opts.httpOnly) str += `; HttpOnly`
    return str
  }
}
