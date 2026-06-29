import fs from 'node:fs/promises';
import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';

export class MainGenerator implements IGenerator {
  shouldGenerate(): boolean {
    return true; // Ogni applicazione necessita di un punto di ingresso
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const content = this.composeMain();
    const filePath = path.join(projectPath, 'src', 'main.ts');
    await fs.writeFile(filePath, content);
  }

  private composeMain(): string {
    return `import { bootstrap } from './bootstrap.js';

/**
 * Main application entry point.
 * This is the orchestrator that initializes the Graviton5 container
 * and starts your transport layers (HTTP servers, message brokers, etc.).
 */
async function main() {
  try {
    console.log('⏳ Bootstrapping @graviton5 application...');
    
    // Initialize the dependency injection container and infrastructure modules
    const container = await bootstrap();
    
    console.log('✅ Application started successfully!');

    // Start your application layers here.
    // Example:
    // const server = container.resolve(MY_HTTP_SERVER_TOKEN);
    // await server.start();
    
  } catch (error) {
    console.error('❌ Critical error during startup:', error);
    process.exit(1);
  }
}

main();
`;
  }
}