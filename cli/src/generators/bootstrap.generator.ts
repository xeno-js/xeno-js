import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';
import { FileUtils } from '../utils/file.utils';

/**
 * @file bootstrap.ts
 * @description This file defines the bootstrap function for the application. The bootstrap function is responsible for initializing and configuring the application, including setting up the database, HTTP client, cache, authentication, and logging services based on the provided configuration.
 */

/**
 * The bootstrap function is the entry point for initializing the application. It uses the AppBuilder to configure various services and modules based on the provided configuration.
 * The function returns a fully built application instance that can be used to start the application.
 * 
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js 
 */
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
      "import { AppBuilder } from '@xeno/core';\nimport { MyRegistry } from './registry';",
      options.logging ? "import { LOG_LEVEL } from '@xeno/core';" : "",
    ].filter(Boolean).join('\n');

    const snippets = this.composeModules(options);
    const body = snippets.length > 0 ? `\n${snippets}\n` : '\n';

    return `${imports}

export async function bootstrap() {
  const builder = new AppBuilder<MyRegistry>();
${body}
  return await builder.build();
}
`;
  }

  private composeModules(options: ScaffoldingOptions): string {
    const snippets: string[] = [];

    if (options.database || options.sqlLite) snippets.push(this.getDbSnippet(options));
    if (options.http) snippets.push(this.getHttpSnippet());
    if (options.redis) snippets.push(this.getCacheSnippet());
    if (options.supabase) snippets.push(this.getAuthSnippet());
    if(options.logging && options.sentry) {
        snippets.push(this.getLoggerSnippet());
    } else if (options.logging) snippets.push(this.getPinoSnippet());
    else if (options.sentry) snippets.push(this.getSentrySnippet());

    return snippets.map(s => `  ${s}`).join('\n\n');
  }

  private getDbSnippet(options: ScaffoldingOptions): string {
    if (options.sqlLite) {
      return `builder.addDb((opts, config) => {
    opts.connectionString = config.getOrThrow('SQLITE_DATABASE_URL');
    opts.enableSqlLite = true;
  });`;
    }

    return `builder.addDb((opts, config) => {
    opts.connectionString = config.getOrThrow('DATABASE_URL');
  });`;
  }

  private getHttpSnippet(): string {
    return `builder.addHttpCore((opts, config) => {
      opts.dataSourceToken = (container) => {
        // Remember to replace 'MY_HTTP_CLIENT_TOKEN' and 'MY_DATA_SOURCE_TOKEN' with your actual HTTP client and data source tokens in the registry.
        const client = c.resolve('MY_HTTP_CLIENT_TOKEN'); // Replace with your custom HTTP client token
        const resilienceClient = c.resolve(TOKENS.RESILIENCE_CLIENT);
        
        container.addSingleton('MY_DATA_SOURCE_TOKEN', /** Replace with your custom data source implementation **/);
      }
      opts.http.token = 'MY_HTTP_CLIENT_TOKEN' // Replace with your custom HTTP client token
      opts.http.client.baseURL = config.getOrThrow('HTTP_BASE_URL');
      opts.resilience.retry.attempts = config.getNumber('HTTP_RETRY_ATTEMPTS') ?? 3;
  });`;
  }

  private getCacheSnippet(): string {
    return `builder.addCache((opts, config) => {
    opts.inMemory = false;
    opts.redis = { host: config.getOrThrow('REDIS_HOST'), port: config.getNumber('REDIS_PORT') ?? 6379, password: config.get('REDIS_PASSWORD') ?? '', username: config.get('REDIS_USERNAME') ?? '', tls: config.get('REDIS_TLS') === 'true', maxRetriesPerRequest: 3 };
  });`;
  }

  private getAuthSnippet(): string {
    return `builder.addAuth((opts, config) => {
    opts.url = config.getOrThrow('SUPABASE_URL');
    opts.key = config.getOrThrow('SUPABASE_KEY');
  });`;
  }

  private getPinoSnippet(): string {
    return `builder.addLogger((opts, config) => {
    opts.level = config.get('LOG_LEVEL') as any ?? LOG_LEVEL.INFO;
    opts.console = false
    //config.pino.config = { env: config.getOrThrow('NODE_ENV'), destination: process.env.LOG_DESTINATION, prettyPrint: process.env.LOG_PRETTY_PRINT === 'true' }
  });`;
  }

  private getSentrySnippet(): string {
    return `builder.addLogger((opts, config) => {
    opts.level = config.get('LOG_LEVEL') as any ?? LOG_LEVEL.INFO;
    opts.console = false
    //config.sentry.config = { dsn: config.getOrThrow('SENTRY_DSN'), environment: config.getOrThrow('SENTRY_ENVIRONMENT') }
  });`;
  }

  private getLoggerSnippet(): string {
    return `builder.addLogger((opts, config) => {
    opts.level = config.get('LOG_LEVEL') as any ?? LOG_LEVEL.INFO;
    opts.console = false
    //config.pino.config = { env: config.getOrThrow('NODE_ENV'), destination: config.getOrThrow('LOG_DESTINATION'), prettyPrint: config.get('LOG_PRETTY_PRINT') === 'true' ?? false }
    //config.sentry.config = { dsn: config.getOrThrow('SENTRY_DSN'), environment: config.getOrThrow('SENTRY_ENVIRONMENT') }
  });`;
  }
}