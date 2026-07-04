import { SupabaseClient } from '@supabase/supabase-js'

import type { IAuthService, IFactory } from '@/domain'

import { SupabaseClaimsMapper } from '../mappers/supabase-claims.mapper'
import type { AuthClientConfig } from '../modules/config/auth.config'
import { SupabaseAuthService } from '../services/auth/supabase-auth.service'

/**
 * @description Factory class responsible for creating instances of SupabaseAuthService based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the SupabaseAuthService, including the initialization of the underlying SupabaseClient instance with the specified configuration options such as URL and API key. This design promotes separation of concerns and allows for flexibility in managing SupabaseAuthService instances across the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class SupabaseAuthServiceFactory implements IFactory<AuthClientConfig, IAuthService> {
  public create(config: AuthClientConfig): IAuthService {
    const client = new SupabaseClient(config.url, config.key, config.options)
    const mapper = new SupabaseClaimsMapper()
    return new SupabaseAuthService(client, mapper)
  }
}
