import type { SupabaseClientOptions } from '@supabase/supabase-js'
import { SupabaseClient } from '@supabase/supabase-js'
import type { AuthClientConfig, IAuthService, IFactory } from '@xeno-js/shared'
import { SupabaseClaimsMapper, SupabaseSessionMapper } from '@xeno-js/shared'

import { SupabaseAuthService } from '../services/auth/supabase-auth.service'
import type { XenoRegistry } from '../xeno-registry'

/**
 * @description Factory class responsible for creating instances of SupabaseAuthService based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the SupabaseAuthService, including the initialization of the underlying SupabaseClient instance with the specified configuration options such as URL and API key. This design promotes separation of concerns and allows for flexibility in managing SupabaseAuthService instances across the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class SupabaseAuthServiceFactory<
  TRegistry extends XenoRegistry = XenoRegistry,
> implements IFactory<AuthClientConfig<TRegistry, SupabaseClientOptions<'public'>>, IAuthService> {
  public create(
    config: AuthClientConfig<TRegistry, SupabaseClientOptions<'public'>>,
  ): IAuthService {
    const client = new SupabaseClient(config.url, config.key, config.options)
    const mapper = new SupabaseClaimsMapper()
    const sessionMapper = new SupabaseSessionMapper(mapper)
    return new SupabaseAuthService(client, mapper, sessionMapper)
  }
}
