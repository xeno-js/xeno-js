import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

/**
 * @class FileUtils
 * @description Utility class for file operations, including recursive file writing.
 * 
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js 
 */
export const FileUtils = Object.freeze({
  writeFileRecursive: async (filePath: string, content: string) => {
    const dir = dirname(filePath);

    await mkdir(dir, { recursive: true });

    await writeFile(filePath, content, 'utf8');
  }
} as const);