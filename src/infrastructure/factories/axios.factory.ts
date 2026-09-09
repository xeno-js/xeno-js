import type { HttpClientConfig, IFactory, IHttpClient } from '@xeno-js/shared'
import axios from 'axios'

import { AxiosHttpClient } from '../http/axios.http'

/**
 * @description Factory class responsible for creating instances of AxiosHttpClient based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the AxiosHttpClient, including the initialization of the underlying Axios instance with the specified configuration options such as base URL, default headers, and timeout settings. This design promotes separation of concerns and allows for flexibility in managing AxiosHttpClient instances across the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class AxiosFactory implements IFactory<HttpClientConfig, IHttpClient> {
  public create(config: HttpClientConfig): IHttpClient {
    const axiosInstance = axios.create({
      baseURL: config.baseURL,
      headers: config.defaultHeaders,
      timeout: config.timeoutMs,
    })

    return new AxiosHttpClient(axiosInstance)
  }
}
