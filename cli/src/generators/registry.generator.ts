import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';
import { FileUtils } from '../utils/file.utils';

/**
 * @class RegistryGenerator
 * @description This generator creates the registry.ts file for the project.
 * 
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js 
 */
export class RegistryGenerator implements IGenerator {
  shouldGenerate(): boolean {
    return true;
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const content = this.composeRegistryContent();
    const filePath = path.join(projectPath, 'src', 'registry.ts');
    await FileUtils.writeFileRecursive(filePath, content);
  }

  private composeRegistryContent(): string {
    return `import { XenoRegistry } from '@xeno/core';
    
/**
 * @file registry.ts
 * @description This file defines the 'Injection Tokens' for the Dependency Injection system. A registry entry is a unique identifier (usually a Symbol) used by the Xeno container to resolve dependencies in a type-safe and decoupled manner.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Registry Tokens
// ─────────────────────────────────────────────────────────────────────────────
// This file defines the 'Injection Tokens' for the Dependency Injection system. A registry entry is a unique identifier (usually a Symbol) used by the Xeno container to resolve dependencies in a type-safe and decoupled manner.
// ─────────────────────────────────────────────────────────────────────────────
// Uncomment the following lines and replace with your own registry entries as needed.
// export interface MyRegistry extends XenoRegistry<{ /** Your Db Schema here **/}> {
//      /** Your services here <string, class> **/
//      MY_SERVICE: MyService
// }
`;
  }
}