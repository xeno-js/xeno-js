import type { Optional } from '@/shared'

/**
 * @description
 * This interface defines the contract for a configuration service that provides methods to retrieve configuration values.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IConfigurationService {
  /**
   * Retrieves a configuration value as a string. Returns the default value if the key is not present.
   * @param key - The configuration key to retrieve.
   * @param defaultValue - The default value to return if the key is not present.
   * @returns The configuration value as a string, or the default value if the key is not present.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  get(key: string, defaultValue?: string): Optional<string>

  /**
   * Retrieves a configuration value as a number. Returns the default value if the key is not present.
   * @param key - The configuration key to retrieve.
   * @param defaultValue - The default value to return if the key is not present.
   * @returns The configuration value as a number, or the default value if the key is not present.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  getNumber(key: string, defaultValue?: number): Optional<number>

  /**
   * Retrieves a configuration value as a boolean. Returns the default value if the key is not present.
   * @param key - The configuration key to retrieve.
   * @param defaultValue - The default value to return if the key is not present.
   * @returns The configuration value as a boolean, or the default value if the key is not present.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  getBoolean(key: string, defaultValue?: boolean): Optional<boolean>

  /**
   * Retrieves a configuration value as a string. Throws an error if the key is not present.
   * @param key - The configuration key to retrieve.
   * @returns The configuration value as a string.
   * @throws An error if the key is not present in the configuration.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  getOrThrow(key: string): string
}
