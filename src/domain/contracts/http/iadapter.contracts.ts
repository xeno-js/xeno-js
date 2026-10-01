import type { ExtendedRequest } from '@xeno-js/shared'

/**
 * @description Interface for a WebTransport.
 * @author Xeno
 * @version 1.2.1
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface XenoWebTransport {
  /**
   * @description The Extendend native request.
   * @type ExtendedRequest
   */
  request: ExtendedRequest
  /**
   * @description The native response.
   * @type Response
   */
  response: Response
}

/**
 * @description Interface for an HTTP adapter.
 * @author Xeno
 * @version 1.2.1
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface IHttpAdapter<TReq = Request, TRes = Response> {
  /**
   * @description Adapts an HTTP request and response to an ExtendedRequest and Response.
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @returns An object containing the adapted ExtendedRequest and Response.
   */
  adapt(req: TReq, res: TRes): XenoWebTransport
}
