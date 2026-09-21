import {
  Guards,
  type HttpHeaders,
  type IServiceExtractor,
  type Optional,
  StringHelper,
} from '@xeno-js/shared'

/**
 * @description The SupabaseSsrTokenExtractor class is a specialized implementation of the IServiceExtractor interface that extracts the Supabase SSR token from the HTTP headers. It is designed to work with Supabase's server-side rendering (SSR) functionality, where the token is stored in the HTTP headers for server-side rendering purposes. The extract method retrieves the token from the headers and returns it as a string.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class SupabaseSsrTokenExtractor implements IServiceExtractor<HttpHeaders, Optional<string>> {
  extract(headers: HttpHeaders): Optional<string> {
    const authHeader = StringHelper.getSingleValue(headers['authorization'])
    if (Guards.isDefined(authHeader) && authHeader.toLowerCase().startsWith('bearer ')) {
      return authHeader.substring(7)
    }

    const cookieHeader = StringHelper.getSingleValue(headers['cookie'])
    if (Guards.isNullOrEmpty(cookieHeader)) return undefined

    const cookies = cookieHeader.split(';').map((c) => c.trim())
    const tokenChunks: Record<number, string> = {}
    let unchunkedToken: Optional<string>

    for (const cookie of cookies) {
      const [name, ...rest] = cookie.split('=')
      if (!Guards.isDefined(name) || Guards.isNullOrEmpty(rest)) continue
      const value = decodeURIComponent(rest.join('='))

      if (Guards.isDefined(/^sb-[a-z0-9]+-auth-token$/.exec(name))) {
        unchunkedToken = value
      } else {
        const match = /^sb-[a-z0-9]+-auth-token\.(\d+)$/.exec(name)
        if (Guards.isDefined(match)) tokenChunks[parseInt(match[1], 10)] = value
      }
    }

    let fullTokenString = unchunkedToken
    if (!Guards.isDefined(fullTokenString) && Object.keys(tokenChunks).length > 0) {
      const indices = Object.keys(tokenChunks)
        .map(Number)
        .sort((a, b) => a - b)
      fullTokenString = indices.map((i) => tokenChunks[i]).join('')
    }

    if (Guards.isNullOrEmpty(fullTokenString)) return undefined

    try {
      const parsed = StringHelper.safeParse(fullTokenString)
      if (Guards.isDefined(parsed) && Guards.isObject(parsed) && 'access_token' in parsed) {
        const accessToken = parsed['access_token']
        if (Guards.isString(accessToken)) return accessToken
      }
    } catch {
      return undefined
    }
  }
}
