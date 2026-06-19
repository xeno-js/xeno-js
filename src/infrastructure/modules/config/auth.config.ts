import type { Dictionary, Optional } from '@/shared'
/**
 * @description An interface representing the configuration required to initialize an authentication client, such as Supabase. This typically includes the URL of the authentication service, the API key for authentication, and any additional options that may be necessary for configuring the client.
 */
export interface AuthClientConfig {
  /**
   * The URL of the authentication service (e.g., Supabase).
   */
  url: string
  /**
   * The API key used for authenticating with the authentication service.
   */
  key: string
  /**
   * Additional options for configuring the authentication client, such as connection settings, timeouts, or other client-specific configurations.
   */
  options: Optional<Dictionary>
}
