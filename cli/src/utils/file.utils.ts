import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';


export const FileUtils = Object.freeze({
  writeFileRecursive: async (filePath: string, content: string) => {
    const dir = dirname(filePath);

    await mkdir(dir, { recursive: true });

    await writeFile(filePath, content, 'utf8');
  }
} as const);