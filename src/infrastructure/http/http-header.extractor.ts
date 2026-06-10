import type { IHttpHeaderExtractor } from '@/domain'
import { Guards, GuidHelper, type HttpHeaders, type Optional } from '@/shared'
import type { Metadata } from '@/shared/types/middleware.types'

/**
 * @description The HttpHeaderExtractor class implements the IHttpHeaderExtractor interface, providing a concrete implementation for extracting HTTP header values from an incoming HttpRequest. The extract method retrieves the value of a specified header, handling both string and array formats for header values. If the header is not present or if the headers object is null or empty, it returns undefined, allowing for consistent handling of missing headers in the application.
 */
export class HttpHeaderExtractor implements IHttpHeaderExtractor {
  extract(headers: HttpHeaders): Metadata {
    const correlationId = GuidHelper.parse(this.getHeaderValue(headers['x-correlation-id']))
    const requestId = GuidHelper.parse(this.getHeaderValue(headers['x-request-id']))
    const token = this.getHeaderValue(headers['authorization'])
    const clientIp = this.getHeaderValue(headers['x-forwarded-for'])
    const spanId = this.getHeaderValue(headers['x-span-id'])

    const metadata: Metadata = {
      correlationId: correlationId ?? GuidHelper.generate(),
      requestId: requestId ?? GuidHelper.generate(),
      token,
      clientIp,
      spanId,
    }

    return metadata
  }

  private getHeaderValue(value: string | string[]): Optional<string> {
    if (Guards.isArray(value)) {
      if (Guards.isNullOrEmpty(value)) {
        return undefined
      }
      return value[0]
    }
    return value
  }
}
