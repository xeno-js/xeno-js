import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Guards } from '@xeno-js/shared'

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
  public adapt(req: VercelRequest, res: VercelResponse): XenoWebTransport {
    const headers = this.parseHeaders(req.headers)
    const url = this.parseUrl(req.url, req.headers, req.query)
    return this.createXenoWebTransport(url, req.method, headers, req.body, res)
  }

  protected handleHeaderChange(
    res: VercelResponse,
    name: string,
    value: string,
    action: 'set' | 'append' | 'delete',
  ): void {
    if (action === 'delete') {
      res.removeHeader(name)
      return
    }

    if (name.toLowerCase() === 'set-cookie') {
      const existing = res.getHeader('Set-Cookie')
      let cookies: string[] = []
      if (Guards.isArray(existing)) {
        cookies = existing
      } else if (Guards.isString(existing)) {
        cookies = [existing]
      }
      if (action === 'append') {
        cookies.push(value)
      } else {
        cookies = [value]
      }
      res.setHeader('Set-Cookie', cookies)
    } else {
      res.setHeader(name, value)
    }
  }
}
