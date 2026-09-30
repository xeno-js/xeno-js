import type {
  AuthConfig,
  CookieOptions,
  IExtendendAuthService,
  IServiceExtractor,
  Optional,
} from '@xeno-js/shared'

import type { IServiceContainer } from '../contracts'
import type { ApplicationRegistry } from '../registries'

export interface ISsrCookie {
  name: string
  value: string
}

export interface ISsrCookieToSet extends ISsrCookie {
  options?: CookieOptions
}

export interface ISsrCookieHandler {
  getAll(): ISsrCookie[]
  setAll(cookies: ISsrCookieToSet[]): void
}

export interface CookieHandlerOptions extends CookieOptions {
  httpOnly: boolean
}

export interface AuthSsrConfig<
  TOption,
  TRegistry extends ApplicationRegistry = ApplicationRegistry,
> extends AuthConfig<TOption> {
  ssrOpts: Optional<(container: IServiceContainer<TRegistry>) => ISsrCookieHandler>
  cookieOpts: CookieHandlerOptions
  customAuth: Optional<{
    authHeaderExtractor: () => IServiceExtractor<Request['headers'], Optional<string>>
    authExtendedService: () => IExtendendAuthService
  }>
}
