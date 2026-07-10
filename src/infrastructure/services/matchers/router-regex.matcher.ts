// infrastructure/http/regex-route-matcher.ts
import type { IMatcher } from '@/domain'
import type { HttpMethod, RouteRegistry } from '@/shared'

interface CompiledRoute {
  regex: RegExp
  methods: Record<HttpMethod, 'isPublic'>
}

/**
 * @description RegexRouteMatcher is a class that implements the IMatcher interface to match HTTP requests against a set of public routes defined in a RouteRegistry. It compiles the route patterns into regular expressions for efficient matching and checks if a given request's method and path correspond to a public route.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class RegexRouteMatcher implements IMatcher<{ method: HttpMethod; path: string }> {
  /**
   * @description An array of compiled routes, each containing a regular expression for matching and the associated HTTP methods.
   * @private
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  private readonly _compiledRoutes: CompiledRoute[] = []

  /**
   * @description Creates an instance of RegexRouteMatcher and compiles the provided public routes into regular expressions for matching.
   * @param publicRoutes - A RouteRegistry object containing the public routes to be matched.
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  constructor(publicRoutes: RouteRegistry) {
    for (const [pathPattern, methods] of Object.entries(publicRoutes)) {
      this._compiledRoutes.push({
        regex: this._compilePathToRegex(pathPattern),
        methods,
      })
    }
  }

  public match({ method, path }: { method: HttpMethod; path: string }): boolean {
    const cleanPath = path.split('?')[0].replace(/\/$/, '') ?? '/'

    for (const route of this._compiledRoutes) {
      if (route.regex.test(cleanPath)) {
        return route.methods[method] === 'isPublic'
      }
    }

    return false
  }

  /**
   * @description Compiles a route pattern into a regular expression for matching.
   * @param pattern - The route pattern to compile (e.g., '/users/:id').
   * @returns A RegExp object that can be used to match against request paths.
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  private _compilePathToRegex(pattern: string): RegExp {
    const cleanPattern = pattern === '/' ? '/' : pattern.replace(/\/$/, '')

    const regexString = cleanPattern
      .replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
      .replace(/\\\/:[a-zA-Z0-9_]+/g, '/[^/]+')

    return new RegExp(`^${regexString}\\/?$`)
  }
}
