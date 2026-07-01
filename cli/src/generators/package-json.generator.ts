import fs from 'node:fs';
import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';
import { FileUtils } from '../utils/file.utils';

export class PackageJsonGenerator implements IGenerator {
  shouldGenerate(_options: ScaffoldingOptions): boolean {
    return true;
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const packageJson = {
      name: options.targetDir,
      version: "1.0.0",
      private: true,
      type: "module",
      scripts: this.getScripts(options),
      dependencies: this.getDependencies(options),
      devDependencies: this.getDevDependencies(options),
    };

    const filePath = path.join(projectPath, 'package.json');
    await FileUtils.writeFileRecursive(filePath, JSON.stringify(packageJson, null, 2));
  }

  private getDependencies(options: ScaffoldingOptions): Record<string, string> {
    const deps: Record<string, string> = {
      "@xeno/core": "latest",
      "zod": "^4.4.3",
    };

    if (options.database) {
      deps["drizzle-orm"] = "^0.45.2";
      deps["pg"] = "^8.22.0";
      deps["postgres"] = "^3.4.9";
      deps["dotenv"] = "^16.4.5";
    }

    if (options.http) {
      deps["axios"] = "^1.16.1";
      deps["cockatiel"] = "^4.0.0";
    }

    if (options.supabase) {
      deps["@supabase/supabase-js"] = "^2.35.0";
    }

    if (options.logging) {
      deps["pino"] = "^10.3.1";
    }

    if (options.sentry) {
      deps["@sentry/node"] = "^7.64.0";
    }

    if (options.redis) {
      deps["ioredis"] = "^5.3.1";
    }

    return deps;
  }

  private getDevDependencies(options: ScaffoldingOptions): Record<string, string> {
    const devDeps: Record<string, string> = {
      "tsx": "^4.7.0",
      "typescript": "^5.4.0",
      "@types/node": "^20.0.0"
    };

    if (options.database) {
      devDeps["drizzle-kit"] = "^0.31.10";
      devDeps["@types/pg"] = "^8.11.0";
    }

    if (options.logging) {
      devDeps["pino-pretty"] = "^11.2.2";
    }

    return devDeps;
  }

  private getScripts(options: ScaffoldingOptions): Record<string, string> {
    const scripts: Record<string, string> = {
      "start": "tsx src/main.ts",
      "dev": "tsx watch src/main.ts"
    };

    if (options.database) {
      scripts["db:generate"] = "drizzle-kit generate";
      scripts["db:push"] = "drizzle-kit push";
      scripts["db:migrate"] = "drizzle-kit migrate";
    }

    return scripts;
  }
}