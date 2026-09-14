import http from 'node:http'
import https from 'node:https'

import type { HttpClientConfig, IHttpClient } from '@xeno-js/shared'
import { AxiosFactory, AxiosHttpClient } from '@xeno-js/shared'
import axios from 'axios'

export class NodeAxiosFactory extends AxiosFactory {
  public override create(config: HttpClientConfig): IHttpClient {
    const isKeepAlive = config.keepAlive ?? true
    const maxSockets = config.maxSockets ?? 100

    const httpAgent = new http.Agent({
      keepAlive: isKeepAlive,
      maxSockets,
      scheduling: 'lifo',
    })

    const httpsAgent = new https.Agent({
      keepAlive: isKeepAlive,
      maxSockets,
      scheduling: 'lifo',
    })

    const axiosInstance = axios.create({
      baseURL: config.baseURL,
      headers: config.defaultHeaders,
      timeout: config.timeoutMs,
      httpAgent,
      httpsAgent,
      maxRedirects: config.maxRedirects ?? 5,
      decompress: config.decompress ?? true,
      proxy: false,
      withCredentials: config.withCredentials,
    })

    return new AxiosHttpClient(axiosInstance)
  }
}
