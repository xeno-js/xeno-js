/**
 * @description The IServiceExtractor interface defines a contract for extracting metadata from HTTP headers. Implementing classes must provide the extract method, which takes HttpHeaders as input and returns a Metadata object containing the extracted information. This allows for flexible and consistent extraction of metadata across different parts of the application, such as authentication, logging, or request validation.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IServiceExtractor<TRequest, TResponse = unknown> {
  /**
   * @description The extract method retrieves metadata from the provided HttpHeaders. Implementing classes must provide this method to allow flexible extraction of metadata for various purposes such as authentication, logging, or request validation.
   * @param headers The HTTP headers from which the metadata will be extracted. This object typically contains key-value pairs representing the headers of the incoming request.
   * @returns A Metadata object containing the extracted metadata information. This allows for handling both success and error cases in a consistent manner.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  extract(headers: TRequest): TResponse
}
