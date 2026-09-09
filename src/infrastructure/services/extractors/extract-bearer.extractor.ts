import type { HttpHeaders, IServiceExtractor, Optional } from '@xeno-js/shared'
import { Guards, StringHelper } from '@xeno-js/shared'

/**
 * @description The BearerTokenExtractor class implements the IExtractor interface, providing a concrete implementation for extracting Bearer tokens from the Authorization header of an incoming HTTP request. The extract method checks for the presence of the Authorization header, verifies that it starts with the "Bearer " prefix, and returns the token value if valid. If the header is missing or does not conform to the expected format, it returns undefined, allowing for consistent handling of authentication tokens in the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class BearerTokenExtractor implements IServiceExtractor<HttpHeaders, Optional<string>> {
  extract(headers: HttpHeaders): Optional<string> {
    const authHeader = StringHelper.getSingleValue(headers['authorization'])
    if (!Guards.isDefined(authHeader)) {
      return undefined
    }

    if (authHeader.toLowerCase().startsWith('bearer ')) {
      return authHeader.substring(7)
    }

    const cookieHeader = StringHelper.getSingleValue(headers['cookie'])
    if (Guards.isDefined(cookieHeader)) {
      const match = /sb-access-token=([^;]+)/.exec(cookieHeader)
      if (!Guards.isNullOrEmpty(match) && Guards.isDefined(match[1])) {
        return match[1].trim()
      }
    }

    return undefined
  }
}
