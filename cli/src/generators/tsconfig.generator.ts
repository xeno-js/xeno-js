import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';
import { FileUtils } from '../utils/file.utils';

export class TsconfigGenerator implements IGenerator {
  shouldGenerate(): boolean {
    return true;
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const tsconfig = {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "bundler",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        types: ["node"]
      },
      include: this.getIncludeFiles(options)
    };

    const filePath = path.join(projectPath, 'tsconfig.json');
    await FileUtils.writeFileRecursive(filePath, JSON.stringify(tsconfig, null, 2));
  }

  private getIncludeFiles(options: ScaffoldingOptions): string[] {
    const include = ["src/**/*"];
    
    // Se è presente il database, includiamo la config di Drizzle nel compilatore
    if (options.database) {
      include.push("drizzle.config.ts");
    }
    
    return include;
  }
}