import fs from 'node:fs/promises';
import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';
import { FileUtils } from '../utils/file.utils';

export class BootstrapGenerator implements IGenerator {
  shouldGenerate(): boolean {
    return true;
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const content = this.composeBootstrap(options);
    const filePath = path.join(projectPath, 'src', 'bootstrap.ts');
    await FileUtils.writeFileRecursive(filePath, content);
  }

  private composeBootstrap(options: ScaffoldingOptions): string {
    const imports = [
      "import { AppBuilder } from '@graviton5/core';",
      options.logging ? "import { LOG_LEVEL } from '@graviton5/core';" : ""
    ].filter(Boolean).join('\n');

    const snippets = this.composeModules(options);
    const body = snippets.length > 0 ? `\n${snippets}\n` : '\n';

    return `${imports}

export async function bootstrap() {
  const builder = new AppBuilder();
${body}
  return await builder.build();
}
`;
  }

  private composeModules(options: ScaffoldingOptions): string {
    const snippets: string[] = [];

    if (options.database) snippets.push(this.getDbSnippet());
    if (options.http) snippets.push(this.getHttpSnippet());
    if (options.redis) snippets.push(this.getCacheSnippet());
    if (options.supabase) snippets.push(this.getAuthSnippet());
    if(options.logging && options.sentry) {
        snippets.push(this.getLoggerSnippet());
    } else if (options.logging) snippets.push(this.getPinoSnippet());
    else if (options.sentry) snippets.push(this.getSentrySnippet());

    return snippets.map(s => `  ${s}`).join('\n\n');
  }

  private getDbSnippet(): string {
    return `builder.addDb(opts => {
    opts.connectionString = process.env.DATABASE_URL!;
  });`;
  }

  private getHttpSnippet(): string {
    return `builder.addHttpCore(opts => {
    opts.http.client.baseURL = process.env.HTTP_BASE_URL!;
    opts..resilience.retry.attempts = Number(process.env.HTTP_RETRY_ATTEMPTS) || 3;
  });`;
  }

  private getCacheSnippet(): string {
    return `builder.addCache(opts => {
    opts.inMemory = false
    opts.redis = { host: 'localhost', port: 6379, password: '', username: '', tls: false, maxRetriesPerRequest: 3 }
  });`;
  }

  private getAuthSnippet(): string {
    return `builder.addAuth(opts => {
    opts.url = process.env.SUPABASE_URL!;
    opts.key = process.env.SUPABASE_KEY!;
  });`;
  }

  private getPinoSnippet(): string {
    return `builder.addLogger(opts => {
    opts.level = process.env.LOG_LEVEL as any || LOG_LEVEL.INFO;
    opts.console = false
    //config.pino.config = { env: process.env.NODE_ENV, destination: process.env.LOG_DESTINATION, prettyPrint: process.env.LOG_PRETTY_PRINT === 'true' }
  });`;
  }

  private getSentrySnippet(): string {
    return `builder.addLogger(opts => {
    opts.level = process.env.LOG_LEVEL as any || LOG_LEVEL.INFO;
    opts.console = false
    //config.sentry.config = { dsn: process.env.SENTRY_DSN!, environment: process.env.SENTRY_ENVIRONMENT! }
  });`;
  }

  private getLoggerSnippet(): string {
    return `builder.addLogger(opts => {
    opts.level = process.env.LOG_LEVEL as any || LOG_LEVEL.INFO;
    opts.console = false
    //config.pino.config = { env: process.env.NODE_ENV, destination: process.env.LOG_DESTINATION, prettyPrint: process.env.LOG_PRETTY_PRINT === 'true' }
    //config.sentry.config = { dsn: process.env.SENTRY_DSN!, environment: process.env.SENTRY_ENVIRONMENT! }
  });`;
  }
}