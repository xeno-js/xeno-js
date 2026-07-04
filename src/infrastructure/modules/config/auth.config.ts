import type { SupabaseClientOptions } from '@supabase/supabase-js'

import type { IAuthService } from '@/domain'
import type { InjectionToken, Optional } from '@/shared'

/**
 * @description An interface representing the configuration required to initialize an authentication client, such as Supabase. This typically includes the URL of the authentication service, the API key for authentication, and any additional options that may be necessary for configuring the client.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface AuthClientConfig {
  /**
   * The URL of the authentication service (e.g., Supabase).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  url: string
  /**
   * The API key used for authenticating with the authentication service.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  key: string
  /**
   * Additional options for configuring the authentication client, such as connection settings, timeouts, or other client-specific configurations.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  options?: Optional<SupabaseClientOptions<'public'>>

  /**
   * An optional injection token for a custom authentication service implementation. This allows for the use of a different authentication service than the default one provided by the module, enabling flexibility in authentication strategies.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  customAuthService?: Optional<InjectionToken<IAuthService>>
}
