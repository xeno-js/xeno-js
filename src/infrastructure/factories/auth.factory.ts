import { SupabaseClient } from '@supabase/supabase-js'

import type { IAuthService, IFactory } from '@/domain'
import { AuthService } from '@/infrastructure'
import type { AuthClientConfig } from '@/shared'

/**
 * @description Factory class responsible for creating instances of AuthService based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the AuthService, including the initialization of the underlying SupabaseClient instance with the specified configuration options such as URL and API key. This design promotes separation of concerns and allows for flexibility in managing AuthService instances across the application.
 */
export class AuthServiceFactory implements IFactory<AuthClientConfig, IAuthService> {
  public create(config: AuthClientConfig): IAuthService {
    return new AuthService(new SupabaseClient(config.url, config.key, config.options))
  }
}
