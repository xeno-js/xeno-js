import type { SupabaseClientOptions } from '@supabase/supabase-js'

import type { Optional } from '@/shared'

/**
 * @description An interface representing the configuration required to initialize an authentication client, such as Supabase. This typically includes the URL of the authentication service, the API key for authentication, and any additional options that may be necessary for configuring the client.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface AuthClientConfig {
  /**
   * The URL of the authentication service (e.g., Supabase).
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  url: string
  /**
   * The API key used for authenticating with the authentication service.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  key: string
  /**
   * Additional options for configuring the authentication client, such as connection settings, timeouts, or other client-specific configurations.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  options?: Optional<SupabaseClientOptions<'public'>>
}
