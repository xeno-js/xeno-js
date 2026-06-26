import fs from 'node:fs/promises';
import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';

export class ReadmeGenerator implements IGenerator {
  shouldGenerate(): boolean {
    return true;
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const content = this.composeReadme(options);
    const filePath = path.join(projectPath, 'README.md');
    await fs.writeFile(filePath, content);
  }

  private composeReadme(options: ScaffoldingOptions): string {
    return `# ${options.targetDir}

Enterprise application built with [Gear5](https://github.com/Mattia-Carcione/gear5).

[![Powered by Gear5](https://img.shields.io/badge/Powered%20by-Gear5-blueviolet?style=flat-square)](https://github.com/Mattia-Carcione/gear5)

## 🚀 Quick Start

### Development
\`\`\`bash
npm install
npm run dev
\`\`\`

## 📖 Documentation
For a deep dive into Gear5 concepts, CQRS pipelines, and Domain-Driven Design principles, visit the [official Gear5 documentation](https://github.com/Mattia-Carcione/gear5/tree/main/docs).

## 🛡️ Architecture
This project leverages Gear5's decoupled architecture:
- **CQRS:** Command Query Responsibility Segregation.
- **Dependency Injection:** Powered by Gear5 IoC container.
- **Resilience:** Built-in fault tolerance via ${options.http ? 'Cockatiel' : 'infrastructure'} patterns.
${options.database ? '- **Persistence:** Drizzle ORM integrated.' : ''}

## 📄 License
Licensed under the ISC License.
`;
  }
}