import fs from 'node:fs/promises';
import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';
import { FileUtils } from '../utils/file.utils';

export class GitIgnoreGenerator implements IGenerator {
  shouldGenerate(): boolean {
    return true; // Ogni progetto deve avere un .gitignore
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const content = this.composeGitIgnore();
    await FileUtils.writeFileRecursive(path.join(projectPath, '.gitignore'), content);
  }

  private composeGitIgnore(): string {
    return `# Dependencies
node_modules/

# Build artifacts
dist/
out/
build/

# Environment variables
# We ignore actual .env files for security, but keep .env.example for documentation
.env
.env.local
.env.*
!.env.example

# Logs
*.log
logs/

# Test coverage
coverage/
.nyc_output/

# OS and IDE
.DS_Store
Thumbs.db
.vscode/
.idea/

# Drizzle (optional: keep migrations in version control)
# drizzle/
`;
  }
}