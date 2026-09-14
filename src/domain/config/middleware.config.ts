import type { Dictionary, HttpMethod, Optional } from '@xeno-js/shared'

export interface MiddlewareConfig {
  isSSR: boolean
  rateLimite: {
    maxRequests: Optional<number>
    windowSeconds: Optional<number>
  }
  csrf: Optional<string>
  optionsMiddleware: boolean
  routeRegistry: Optional<Dictionary<HttpMethod[]>>
  trustedIpHeader: Optional<string>
}
