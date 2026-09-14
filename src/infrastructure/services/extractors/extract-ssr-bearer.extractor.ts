import {
  Guards,
  type HttpHeaders,
  type IServiceExtractor,
  type Optional,
  StringHelper,
} from '@xeno-js/shared'

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
    let unchunkedToken: string | undefined

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
