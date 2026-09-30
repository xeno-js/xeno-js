import { createServerClient } from '@supabase/ssr'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { IExtendendAuthService, IFactory, Optional } from '@xeno-js/shared'
import {
  Guards,
  SupabaseAuthService,
  SupabaseClaimsMapper,
  SupabaseSessionMapper,
  TOKENS,
} from '@xeno-js/shared'

import type {
  AuthSsrConfig,
  CookieHandlerOptions,
  IServiceContainer,
  ISsrCookieHandler,
} from '@/domain'

import { CookieHandler } from '../services'
import type { XenoRegistry } from '../xeno-registry'

interface SupabaseServerAuthFactoryInput<TRegistry extends XenoRegistry> {
  config: AuthSsrConfig<SupabaseClientOptions<'public'>>
  container: IServiceContainer<TRegistry>
}

export class SupabaseServerAuthFactory<
  TRegistry extends XenoRegistry = XenoRegistry,
> implements IFactory<SupabaseServerAuthFactoryInput<TRegistry>, IExtendendAuthService> {
  public create({
    config,
    container,
  }: SupabaseServerAuthFactoryInput<TRegistry>): IExtendendAuthService {
    const cookieService = this._getCookieSsr(config.ssrOpts, container, config.cookieOpts)
    const client = createServerClient(config.url, config.key, {
      ...config.opts,
      cookies: cookieService,
    })

    const mapper = new SupabaseClaimsMapper()
    const sessionMapper = new SupabaseSessionMapper(mapper)

    return new SupabaseAuthService(client, mapper, sessionMapper, config)
  }

  private _getCookieSsr(
    ssrOpts: Optional<(container: IServiceContainer<TRegistry>) => ISsrCookieHandler>,
    container: IServiceContainer<TRegistry>,
    config: CookieHandlerOptions,
  ): ISsrCookieHandler {
    if (Guards.isDefined(ssrOpts)) {
      return ssrOpts(container)
    } else {
      return new CookieHandler(
        container.resolve(TOKENS.REQUEST_CONTEXT),
        container.resolve(TOKENS.CONFIGURATION_SERVICE),
        config,
      )
    }
  }
}
