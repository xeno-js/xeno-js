import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';
import { FileUtils } from '../utils/file.utils';

/**
 * @class ReadmeGenerator
 * @description This generator creates a README.md file for the project.
 * 
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js 
 */
export class ReadmeGenerator implements IGenerator {
  shouldGenerate(): boolean {
    return true;
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const content = this.composeReadme(options);
    const filePath = path.join(projectPath, 'README.md');
    await FileUtils.writeFileRecursive(filePath, content);
  }

  private composeReadme(options: ScaffoldingOptions): string {
    return `# ${options.targetDir}

Enterprise application built with [Xeno](https://github.com/Mattia-Carcione/xeno-js).

[![Powered by Xeno](https://img.shields.io/badge/Powered%20by-Xeno-blueviolet?style=flat-square)](https://github.com/Mattia-Carcione/xeno-js)

## 🚀 Quick Start

### Development
\`\`\`bash
npm install
npm run dev
\`\`\`

## 📖 Documentation
For a deep dive into Xeno concepts, CQRS pipelines, and Domain-Driven Design principles, visit the [official Xeno documentation](https://github.com/Mattia-Carcione/xeno-js/tree/main/docs).

## 🛡️ Architecture
This project leverages Xeno's decoupled architecture:
- **CQRS:** Command Query Responsibility Segregation.
- **Dependency Injection:** Powered by Xeno IoC container.
- **Resilience:** Built-in fault tolerance via ${options.http ? 'Cockatiel' : 'infrastructure'} patterns.
${options.database ? '- **Persistence:** Drizzle ORM integrated.' : ''}

## 📄 License
Licensed under the ISC License.
`;
  }
}