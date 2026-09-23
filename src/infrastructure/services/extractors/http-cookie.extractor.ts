import { Guards, type IServiceExtractor, type Optional } from '@xeno-js/shared'

/**
 * @description The HttpCookieExtractor class implements the IServiceExtractor interface, providing a concrete implementation for extracting HTTP cookie values from an incoming HttpRequest. The extract method retrieves the value of a specified cookie, handling both string and array formats for cookie values. If the cookie is not present or if the cookies object is null or empty, it returns undefined, allowing for consistent handling of missing cookies in the application.
 */
export class HttpCookieExtractor implements IServiceExtractor<
  {
    header: Optional<string>
    name: string
  },
  Optional<string>
> {
  extract(cookie: { header: Optional<string>; name: string }): Optional<string> {
    if (!Guards.isDefined(cookie.header)) return undefined

    for (const rawCookie of cookie.header.split(';')) {
      const separatorIndex = rawCookie.indexOf('=')

      if (separatorIndex <= 0) continue

      const name = rawCookie.slice(0, separatorIndex).trim()

      if (name !== cookie.name) continue

      const value = rawCookie.slice(separatorIndex + 1).trim()

      try {
        return decodeURIComponent(value)
      } catch {
        return undefined
      }
    }

    return undefined
  }
}
