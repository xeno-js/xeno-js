import type { Dictionary, ExtendedRequest, Optional } from '@xeno-js/shared'
import { Guards, StringHelper } from '@xeno-js/shared'

import type { IHttpAdapter, XenoWebTransport } from '@/domain'

/**
 * @description Base HTTP adapter.
 * @author Xeno
 * @version 1.2.1
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export abstract class BaseHttpAdapter<
  TReq = ExtendedRequest,
  TRes = Response,
> implements IHttpAdapter<TReq, TRes> {
  public abstract adapt(req: TReq, res: TRes): XenoWebTransport

  /**
   * @description Parse the URL from the request.
   * @param rawUrl The raw URL.
   * @param headers The headers.
   * @param queryParams The query parameters.
   * @returns The parsed URL.
   */
  protected parseUrl(
    rawUrl = '/',
    headers: Dictionary<Optional<string | string[]>>,
    queryParams: Optional<Dictionary>,
  ): URL {
    const protocol = StringHelper.getSingleValue(headers['x-forwarded-proto']) ?? 'https'
    const host = StringHelper.safeStringify(headers['host']) ?? 'localhost'
    const url = new URL(rawUrl, `${protocol}://${host}`)

    if (!Guards.isNullOrEmpty(queryParams)) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (Guards.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)))
        } else if (Guards.isDefined(value)) {
          url.searchParams.set(key, String(value))
        }
      }
    }

    return url
  }

  /**
   * @description Parses the headers.
   * @param rawHeaders The raw headers.
   * @returns The parsed headers.
   */
  protected parseHeaders(rawHeaders: Dictionary<Optional<string | string[]>>): Headers {
    const headers = new Headers()
    for (const [key, value] of Object.entries(rawHeaders)) {
      if (Guards.isDefined(value)) {
        if (Guards.isArray(value)) {
          value.forEach((v) => headers.append(key, String(v)))
        } else {
          headers.set(key, String(value))
        }
      }
    }
    return headers
  }

  /**
   * @description Parses the body.
   * @param method The method.
   * @param rawBody The raw body.
   * @returns The parsed body.
   */
  protected parseBody(method: Optional<string>, rawBody: unknown): Optional<RequestInit['body']> {
    if (
      !Guards.isDefined(method) ||
      !['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) ||
      !Guards.isDefined(rawBody)
    )
      return undefined

    if (Guards.isObject(rawBody)) return JSON.stringify(rawBody)

    if (
      Guards.isString(rawBody) ||
      rawBody instanceof Blob ||
      rawBody instanceof ArrayBuffer ||
      ArrayBuffer.isView(rawBody) ||
      rawBody instanceof URLSearchParams ||
      rawBody instanceof FormData
    )
      return rawBody as BodyInit

    return String(rawBody)
  }

  /**
   * @description Creates the XenoWebTransport.
   * @param url The url.
   * @param method The method.
   * @param headers The headers.
   * @param body The body.
   * @returns The XenoWebTransport.
   */
  protected createXenoWebTransport(
    url: URL,
    method = 'GET',
    headers: Headers,
    body: Optional<unknown> = undefined,
  ): XenoWebTransport {
    const init: RequestInit & { duplex?: 'half' } = {
      method: method.toUpperCase(),
      headers,
    }

    const parsedBody = this.parseBody(method, body)
    if (Guards.isDefined(parsedBody)) {
      init.body = parsedBody

      init.duplex = 'half'
    }

    return {
      request: {
        ...new Request(url, init),
        path: url.pathname,
      },
      response: new Response(),
    }
  }
}
