/**
 * @description Interface for the crypto service
 */
export interface ICryptoService {
  /**
   * @description Generates a random byte array of the specified size.
   * @param size The size of the byte array to generate.
   * @returns A random byte array of the specified size.
   */
  randomBytes(size: number): Uint8Array
  /**
   * @description Generates a HMAC SHA-256 hash of the specified data using the specified secret.
   * @param secret The secret to use for the HMAC SHA-256 hash.
   * @param data The data to hash.
   * @returns A promise that resolves to the HMAC SHA-256 hash of the specified data.
   */
  hmacSha256(secret: string, data: string): Promise<string>
  /**
   * @description Compares two byte arrays in a way that is resistant to timing attacks.
   * @param a The first byte array to compare.
   * @param b The second byte array to compare.
   * @returns True if the two byte arrays are equal, false otherwise.
   */
  timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean
}
