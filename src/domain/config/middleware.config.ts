import type { Dictionary, HttpMethod, Optional } from '@xeno-js/shared'

/**
 * @description Configuration for the middleware.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface MiddlewareConfig {
  /**
   * @description
   * The isSSR property is a boolean flag that indicates whether the application is running in a server-side rendering (SSR) environment. In an SSR environment, the application is rendered on the server-side and then sent to the client-side for display. This property is useful for configuring middleware or other components that may behave differently in an SSR environment. For example, certain middleware may need to be disabled or modified when running in an SSR environment to prevent issues with server-side rendering. By setting the isSSR property to true or false, developers can configure middleware or other components to behave appropriately in an SSR environment.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  isSSR: boolean
  /**
   * @description
   * The rateLimite property is an object that contains two properties: maxRequests and windowSeconds. These properties are used to configure rate limiting for the application. Rate limiting is a technique used to prevent abuse or excessive use of a system or service by limiting the number of requests that can be made within a given time period. The maxRequests property specifies the maximum number of requests that can be made within the specified windowSeconds, and the windowSeconds property specifies the duration of the window in seconds.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  rateLimite: {
    /**
     * @description
     * The maxRequests property specifies the maximum number of requests that can be made within the specified windowSeconds. This property is used to configure rate limiting for the application. Rate limiting is a technique used to prevent abuse or excessive use of a system or service by limiting the number of requests that can be made within a given time period. The maxRequests property specifies the maximum number of requests that can be made within the specified windowSeconds, and the windowSeconds property specifies the duration of the window in seconds.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    maxRequests: Optional<number>
    /**
     * @description
     * The windowSeconds property specifies the duration of the window in seconds. This property is used to configure rate limiting for the application. Rate limiting is a technique used to prevent abuse or excessive use of a system or service by limiting the number of requests that can be made within a given time period. The windowSeconds property specifies the duration of the window in seconds, and the maxRequests property specifies the maximum number of requests that can be made within the specified windowSeconds.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    windowSeconds: Optional<number>
  }
  /**
   * @description
   * The cors property is an optional property that can be used to configure Cross-Origin Resource Sharing (CORS) for the application. CORS is a mechanism that allows resources on a web page to be requested from another domain outside the domain from which the resource originated. The cors property is an object that contains properties to configure CORS, such as allowedOrigins, allowedMethods, allowedHeaders, and exposedHeaders.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  csrf: Optional<string>
  /**
   * @description
   * The cors property is an optional property that can be used to configure Cross-Origin Resource Sharing (CORS) for the application. CORS is a mechanism that allows resources on a web page to be requested from another domain outside the domain from which the resource originated. The cors property is an object that contains properties to configure CORS, such as allowedOrigins, allowedMethods, allowedHeaders, and exposedHeaders.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  optionsMiddleware: boolean
  /**
   * @description
   * The routeRegistry property is an optional property that can be used to configure the routing of HTTP requests in the application. It is an object that contains properties to define the routes and their corresponding HTTP methods. The routeRegistry property is used to map incoming HTTP requests to the appropriate route handlers, allowing the application to handle requests based on the defined routes and methods.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  routeRegistry: Optional<Dictionary<HttpMethod[]>>
  /**
   * @description
   * The trustedIpHeader property is an optional property that can be used to configure the trusted IP header for the application. It is a string that specifies the name of the header that contains the trusted IP address. This property is used to determine the trusted IP address of the client making the request, which can be useful for security and authentication purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  trustedIpHeader: Optional<string>
  /**
   * @description
   * The allowOrigins property is an optional property that can be used to configure the allowed origins for the application. It is an array of strings that specifies the origins that are allowed to make requests to the application. This property is used to implement Cross-Origin Resource Sharing (CORS) and restrict access to the application based on the origin of the request.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  allowOrigins: Optional<string[]>
}
