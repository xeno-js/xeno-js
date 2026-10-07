import { createServerClient } from '@supabase/ssr'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { IExtendendAuthService, IFactory, Optional } from '@xeno-js/shared'
import { Guards, TOKENS } from '@xeno-js/shared'
import {
  SupabaseAuthService,
  SupabaseClaimsMapper,
  SupabaseSessionMapper,
} from '@xeno-js/shared/supabase'

import type {
  ApplicationRegistry,
  AuthSsrConfig,
  CookieHandlerOptions,
  IServiceContainer,
  ISsrCookieHandler,
} from '@/domain'

import { CookieHandler } from '../services'

interface SupabaseServerAuthFactoryInput<
  TRegistry extends ApplicationRegistry = ApplicationRegistry,
> {
  config: AuthSsrConfig<SupabaseClientOptions<'public'>>
  container: IServiceContainer<TRegistry>
}

export class SupabaseServerAuthFactory<
  TRegistry extends ApplicationRegistry = ApplicationRegistry,
> implements IFactory<SupabaseServerAuthFactoryInput<TRegistry>, IExtendendAuthService> {
  public create({
    config,
    container,
  }: SupabaseServerAuthFactoryInput<TRegistry>): IExtendendAuthService {
    const cookieService = this._getCookieSsr(config.ssrOpts, container, config.cookieOpts)
    const client = createServerClient(config.url, config.key, {
      ...config.opts,
      cookies: {
        getAll() {
          return cookieService.getAll()
        },
        setAll(cookiesToSet) {
          cookieService.setAll(cookiesToSet)
        },
      },
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
        container.resolve(TOKENS.NETWORK_CONTEXT_ACCESSOR),
        container.resolve(TOKENS.CONFIGURATION_SERVICE),
        config,
      )
    }
  }
}
