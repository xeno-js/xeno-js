import type { HttpOptions, HttpRequest, HttpResponse, Optional } from '@/shared'

/**
 * @description Agnostic contract used to execute HTTP calls independently from concrete transport libraries (fetch, axios, undici, etc.).

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IHttpClient {
  /**
   * @description Executes an HTTP GET request to the specified URL with optional request options.
   * @param url The URL to which the GET request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.
   * @param options Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.
   * @returns A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  get<TResponse = unknown>(
    url: string,
    options: Optional<Omit<HttpRequest<never>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>>

  /**
   * @description Executes an HTTP POST request to the specified URL with the provided request body and optional request options.
   * @param url The URL to which the POST request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.
   * @param body The request body to be sent with the POST request. This can be of any type, such as an object, string, or FormData, depending on the requirements of the server endpoint.
   * @param options Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.
   * @returns A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  post<TResponse = unknown, TBody = unknown>(
    url: string,
    body: Optional<TBody>,
    options: Optional<Omit<HttpRequest<TBody>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>>

  /**
   * @description Executes an HTTP PUT request to the specified URL with the provided request body and optional request options.
   * @param url The URL to which the PUT request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.
   * @param body The request body to be sent with the PUT request. This can be of any type, such as an object, string, or FormData, depending on the requirements of the server endpoint.
   * @param options Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.
   * @returns A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  put<TResponse = unknown, TBody = unknown>(
    url: string,
    body: Optional<TBody>,
    options: Optional<Omit<HttpRequest<TBody>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>>

  /**
   * @description Executes an HTTP PATCH request to the specified URL with the provided request body and optional request options.
   * @param url The URL to which the PATCH request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.
   * @param body The request body to be sent with the PATCH request. This can be of any type, such as an object, string, or FormData, depending on the requirements of the server endpoint.
   * @param options Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.
   * @returns A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  patch<TResponse = unknown, TBody = unknown>(
    url: string,
    body: Optional<TBody>,
    options: Optional<Omit<HttpRequest<TBody>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>>

  /**
   * @description Executes an HTTP DELETE request to the specified URL with optional request options.
   * @param url The URL to which the DELETE request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.
   * @param options Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.
   * @returns A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  delete<TResponse = unknown>(
    url: string,
    options: Optional<Omit<HttpRequest<never>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>>
}
