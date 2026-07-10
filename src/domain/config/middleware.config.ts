import type { Optional, RouteRegistry } from '@/shared'

/**
 * @description MiddlewareConfig defines the configuration options for the middleware in the application. It includes settings for route-based authorization, allowing developers to specify which routes require certain roles or permissions. This configuration is used by the MiddlewareModule to set up the appropriate middleware and services in the dependency injection container based on the specified options.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface MiddlewareConfig {
  /** @description Flag to enable role-based authorization. If set to true, the authorization pipeline will include a strategy that checks if the user has the required roles to perform the command or query being executed. This is typically used in applications where access to certain actions is restricted based on user roles, ensuring that only users with the appropriate roles can execute specific operations.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  publicRoutes: Optional<RouteRegistry>
}
