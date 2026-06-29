import type { IServiceExtractor } from '@/domain'
import type { Metadata } from '@/shared'
import { GuidHelper, type HttpHeaders, type Optional, StringHelper } from '@/shared'

/**
 * @description The HttpHeaderExtractor class implements the IServiceExtractor interface, providing a concrete implementation for extracting HTTP header values from an incoming HttpRequest. The extract method retrieves the value of a specified header, handling both string and array formats for header values. If the header is not present or if the headers object is null or empty, it returns undefined, allowing for consistent handling of missing headers in the application.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class HttpHeaderExtractor implements IServiceExtractor<HttpHeaders, Metadata> {
  /**
   * @description Constructor for HttpHeaderExtractor. It takes an instance of IServiceExtractor for extracting Bearer tokens, allowing for separation of concerns and adherence to the Single Responsibility Principle (SRP). This design enables the HttpHeaderExtractor to focus on general header extraction while delegating the specific logic of Bearer token extraction to a dedicated extractor, promoting code reusability and maintainability.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  constructor(
    private readonly _bearerExtractor: IServiceExtractor<HttpHeaders, Optional<string>>,
  ) {}

  extract(headers: HttpHeaders): Metadata {
    const correlationId = GuidHelper.parse(StringHelper.getSingleValue(headers['x-correlation-id']))
    const requestId = GuidHelper.parse(StringHelper.getSingleValue(headers['x-request-id']))
    const token = this._bearerExtractor.extract(headers)
    const clientIp = StringHelper.getSingleValue(headers['x-forwarded-for'])
    const spanId = StringHelper.getSingleValue(headers['x-span-id'])

    const metadata: Metadata = {
      correlationId,
      requestId,
      token,
      clientIp,
      spanId,
    }

    return metadata
  }
}
