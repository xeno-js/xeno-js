import fs from 'node:fs/promises';
import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';

export class TokensGenerator implements IGenerator {
  shouldGenerate(): boolean {
    return true;
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const content = this.composeTokensContent();
    const filePath = path.join(projectPath, 'src', 'tokens.ts');
    await fs.writeFile(filePath, content);
  }

  private composeTokensContent(): string {
    return `import { TokenHelper } from '@gear5/core';
    
/**
 * @file tokens.ts
 * @description In this file, define the 'Injection Tokens' for the Dependency Injection system.
 * * A token is a unique identifier (usually a Symbol) used by the Gear5 container to resolve dependencies in a type-safe and decoupled manner.
 * * HOW TO USE:
 * 1. Define your token: 
 * export const MY_SERVICE_TOKEN = TokenHelper.createToken<MyService>('MY_SERVICE_TOKEN');
 * * 2. In your bootstrap, register the service associated with the token:
 * builder.addService(MY_SERVICE_TOKEN, MyService);
 * * 3. Inject it into your controllers or services via the container:
 * container.resolve(MY_SERVICE_TOKEN);
 */

// --- EXAMPLE ---
// export const EXAMPLE_SERVICE_TOKEN = TokenHelper.createToken<ExampleService>('EXAMPLE_SERVICE_TOKEN');

// Insert your custom tokens for the project here:
`;
  }
}