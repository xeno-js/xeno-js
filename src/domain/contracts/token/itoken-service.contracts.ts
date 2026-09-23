/**
 * @description Interface for the CSRF token service
 */
export interface ICsrfTokenService {
  /**
   * @description Generate a new CSRF token
   * @param subject The subject of the token
   * @returns A promise that resolves to the token
   */
  generate(subject: string): Promise<string>
  /**
   * @description Validate a CSRF token
   * @param token The token to validate
   * @param subject The subject of the token
   * @returns A priomise that resolves to true if the token is valid, false otherwise
   */
  validate(token: string, subject: string): Promise<boolean>
}
