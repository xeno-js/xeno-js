import type { VercelRequest, VercelResponse } from '@vercel/node'

import type { XenoWebTransport } from '@/domain'

import { BaseHttpAdapter } from './base.http-adapter'

/**
 * @description Vercel HTTP adapter.
 * @author Xeno
 * @version 1.2.1
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class VercelHttpAdapter extends BaseHttpAdapter<VercelRequest, VercelResponse> {
  public adapt(req: VercelRequest, _res: VercelResponse): XenoWebTransport {
    const headers = this.parseHeaders(req.headers)
    const url = this.parseUrl(req.url, req.headers, req.query)
    return this.createXenoWebTransport(url, req.method, headers, req.body)
  }
}
