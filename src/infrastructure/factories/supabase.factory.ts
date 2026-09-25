import { createServerClient } from '@supabase/ssr'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { IExtendendAuthService, IFactory } from '@xeno-js/shared'
import {
  Guards,
  SupabaseAuthService,
  SupabaseClaimsMapper,
  SupabaseSessionMapper,
} from '@xeno-js/shared'

import type { AuthSsrConfig, IServiceContainer } from '@/domain'

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
    if (!Guards.isDefined(config.ssrOpts)) {
      throw new Error(
        'ISsrCookieHandler is required for @supabase/ssr initialization., Please provide it in the config object.',
      )
    }

    const cookieService = config.ssrOpts(container)
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
}
