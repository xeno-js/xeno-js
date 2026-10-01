import type { Dictionary, Optional } from '@xeno-js/shared'
import { Guards } from '@xeno-js/shared'
import type { FastifyReply, FastifyRequest } from 'fastify'

import type { XenoWebTransport } from '@/domain'

import { BaseHttpAdapter } from './base.http-adapter'

export class FastifyHttpAdapter extends BaseHttpAdapter<FastifyRequest, FastifyReply> {
  public adapt(req: FastifyRequest, res: FastifyReply): XenoWebTransport {
    const headers = this.parseHeaders(req.headers)

    const url = this.parseUrl(req.url, req.headers, req.query as Optional<Dictionary>)

    const body = req.body

    return this.createXenoWebTransport(url, req.method, headers, body, res)
  }

  protected handleHeaderChange(
    res: FastifyReply,
    name: string,
    value: string,
    action: 'set' | 'append' | 'delete',
  ): void {
    if (action === 'delete') {
      res.removeHeader(name)
      return
    }

    if (name.toLowerCase() === 'set-cookie') {
      const existing = res.getHeader('set-cookie')
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
      res.header('set-cookie', cookies)
    } else {
      res.header(name, value)
    }
  }
}
