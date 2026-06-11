import axios from 'axios'

import type { IFactory, IHttpClient } from '@/domain'
import { AxiosHttpClient } from '@/infrastructure'
import type { HttpClientConfig } from '@/shared'

/**
 * @description Factory class responsible for creating instances of AxiosHttpClient based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the AxiosHttpClient, including the initialization of the underlying Axios instance with the specified configuration options such as base URL, default headers, and timeout settings. This design promotes separation of concerns and allows for flexibility in managing AxiosHttpClient instances across the application.
 */
export class AxiosFactory implements IFactory<HttpClientConfig, IHttpClient> {
  public create(config: HttpClientConfig): IHttpClient {
    const axiosInstance = axios.create({
      baseURL: config.baseURL,
      headers: config.defaultHeaders,
      timeout: config.timeoutMs,
    })

    // Qui puoi aggiungere eventuali intercettori globali se necessario
    // axiosInstance.interceptors.request.use(...)

    // Passiamo l'istanza a un costruttore interno/protetto dell'adapter
    return new AxiosHttpClient(axiosInstance)
  }
}
