import type { Dictionary, Optional } from '@xeno-js/shared'
import type { FastifyReply, FastifyRequest } from 'fastify'

import type { XenoWebTransport } from '@/domain'

import { BaseHttpAdapter } from './base.http-adapter'

export class FastifyHttpAdapter extends BaseHttpAdapter<FastifyRequest, FastifyReply> {
  public adapt(req: FastifyRequest, _res: FastifyReply): XenoWebTransport {
    const headers = this.parseHeaders(req.headers)

    const url = this.parseUrl(req.url, req.headers, req.query as Optional<Dictionary>)

    const body = req.body

    return this.createXenoWebTransport(url, req.method, headers, body)
  }
}
