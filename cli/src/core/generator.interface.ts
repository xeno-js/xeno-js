/**
 * @file generator.interface.ts
 * @description This file defines the interfaces for code generators used in the scaffolding process.
 * Each generator is responsible for creating specific files or configurations based on user-selected options.
 *
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */

/**
 * Represents the options selected by the user during the scaffolding process.
 * These options determine which generators should be executed and what content they should produce.
 * 
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js 
 */
export interface ScaffoldingOptions {
  targetDir: string;
  zod: boolean;
  database: boolean;
  http: boolean;
  supabase: boolean;
  logging: boolean;
  sentry: boolean;
  redis: boolean;
}

/**
 * Represents a code generator that can create files or configurations based on user-selected options.
 * Each generator must implement the `shouldGenerate` method to determine if it should run, and the `generate` method to perform its generation logic.
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IGenerator {
  /**
   * Determines if this generator should be executed based on the user-selected options.
 * 
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js 
 */
  shouldGenerate(options: ScaffoldingOptions): boolean;

  /**
   * Executes the generation logic.
   * Writes files, updates configurations, or prepares templates.
   * @param projectPath - The absolute path of the target directory
   * @param options - The user-selected options
   * 
   * @author Xeno
   * @version 1.0.0
   * @license ISC
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  generate(projectPath: string, options: ScaffoldingOptions): Promise<void>;
}