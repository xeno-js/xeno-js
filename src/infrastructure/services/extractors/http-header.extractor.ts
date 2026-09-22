import type { IServiceExtractor } from '@xeno-js/shared'
import type { Metadata } from '@xeno-js/shared'
import {
  Guards,
  GuidHelper,
  type HttpHeaders,
  HttpHelper,
  MathHelper,
  type Optional,
  StringHelper,
} from '@xeno-js/shared'

/**
 * @description The HttpHeaderExtractor class implements the IServiceExtractor interface, providing a concrete implementation for extracting HTTP header values from an incoming HttpRequest. The extract method retrieves the value of a specified header, handling both string and array formats for header values. If the header is not present or if the headers object is null or empty, it returns undefined, allowing for consistent handling of missing headers in the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
export class HttpHeaderExtractor implements IServiceExtractor<HttpHeaders, Metadata> {
  /**
   * @description Constructor for HttpHeaderExtractor. It takes an instance of IServiceExtractor for extracting Bearer tokens, allowing for separation of concerns and adherence to the Single Responsibility Principle (SRP). This design enables the HttpHeaderExtractor to focus on general header extraction while delegating the specific logic of Bearer token extraction to a dedicated extractor, promoting code reusability and maintainability.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js 
   */
  constructor(
    private readonly _bearerExtractor: IServiceExtractor<HttpHeaders, Optional<string>>,
    private readonly _trustedIp: Optional<string>,
  ) {}

  extract(headers: HttpHeaders): Metadata {
    const correlationId = GuidHelper.parse(StringHelper.getSingleValue(headers['x-correlation-id']))
    const requestId = GuidHelper.parse(StringHelper.getSingleValue(headers['x-request-id']))
    const token = this._bearerExtractor.extract(headers)
    const clientIp =
      StringHelper.getSingleValue(headers[this._trustedIp?.toLowerCase() ?? 'x-forwarded-for']) ??
      StringHelper.getSingleValue(headers['x-real-ip'])
    const spanId = GuidHelper.parse(StringHelper.getSingleValue(headers['x-span-id']))
    const parentSpanId = StringHelper.getSingleValue(headers['x-parent-span-id'])
    const acceptHeader = StringHelper.getSingleValue(headers['accept'])
    const contentTypeHeader = StringHelper.getSingleValue(headers['content-type'])
    const userAgent = StringHelper.getSingleValue(headers['user-agent'])
    const returnAddress = StringHelper.getSingleValue(headers['x-return-address'])
    const sequenceId = StringHelper.getSingleValue(headers['x-sequence-id'])
    const position = StringHelper.getSingleValue(headers['x-sequence-position'])
    const size = StringHelper.getSingleValue(headers['x-sequence-size'])
    const expiration = StringHelper.getSingleValue(headers['x-expiration'])

    const csrf = StringHelper.getSingleValue(headers['x-requested-with'])
    const origin = StringHelper.getSingleValue(headers['origin'])
    const cleanOrigin = HttpHelper.sanitizeOriginUrl(origin)
    const referer = StringHelper.getSingleValue(headers['referer'])
    const cleanReferer = HttpHelper.sanitizeOriginUrl(referer)

    const accept = acceptHeader === '*/*' ? undefined : acceptHeader
    const formatIndicator = accept ?? contentTypeHeader ?? 'application/json'

    const metadata: Metadata = {
      correlationId,
      requestId,
      token,
      clientIp,
      spanId,
      parentSpanId,
      formatIndicator,
      userAgent,
      returnAddress,
      csrf,
      origin: cleanOrigin,
      referer: cleanReferer,
      sequence: {
        sequenceId,
        position: Guards.isDefined(position) ? MathHelper.toNumber(position) : undefined,
        size: Guards.isDefined(size) ? MathHelper.toNumber(size) : undefined,
      },
      expiration: Guards.isDefined(expiration) ? MathHelper.toNumber(expiration) : undefined,
    }

    return metadata
  }
}
