import fs from 'node:fs/promises';
import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';

export class EnvGenerator implements IGenerator {
  shouldGenerate(_options: ScaffoldingOptions): boolean {
    return true;
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const content = this.composeEnvContent(options);
    const filePath = path.join(projectPath, '.env.example');
    await fs.writeFile(filePath, content);
  }

  private composeEnvContent(options: ScaffoldingOptions): string {
    const sections: string[] = [
      '# ─────────────────────────────────────────────────────────────────────────────',
      '# GEAR5 APPLICATION ENVIRONMENT VARIABLES',
      '# ─────────────────────────────────────────────────────────────────────────────',
      'NODE_ENV=development',
    ];

    if (options.database) sections.push(this.getDatabaseSection());
    if (options.http) sections.push(this.getHttpSection());
    if (options.redis) sections.push(this.getRedisSection());
    if (options.supabase) sections.push(this.getSupabaseSection());
    if (options.sentry) sections.push(this.getSentrySection());
    if (options.logging) sections.push(this.getLoggingSection());

    return sections.join('\n\n') + '\n';
  }

  private getDatabaseSection(): string {
    return `# --- Database (Drizzle & PG) ---\nDATABASE_URL=postgres://postgres:password@localhost:5432/gear5_db`;
  }

  private getHttpSection(): string {
    return `# --- HTTP Client (Axios & Cockatiel) ---\nHTTP_BASE_URL=https://api.example.com\nHTTP_TIMEOUT_MS=5000\nHTTP_RETRY_ATTEMPTS=3\nHTTP_RETRY_BASE_DELAY_MS=100\nHTTP_RETRY_MAX_DELAY_MS=1000`;
  }

  private getRedisSection(): string {
    return `# --- Cache (Redis) ---\nREDIS_HOST=localhost\nREDIS_PORT=6379\nREDIS_PASSWORD=\nREDIS_USERNAME=\nREDIS_TLS=false\nREDIS_MAX_RETRIES=3`;
  }

  private getSupabaseSection(): string {
    return `# --- Authentication (Supabase) ---\nSUPABASE_URL=https://your-project.supabase.co\nSUPABASE_KEY=your-anon-key`;
  }

  private getSentrySection(): string {
    return `# --- Error Tracking (Sentry) ---\nSENTRY_DSN=https://your-sentry-dsn@o0.ingest.sentry.io/0\nSENTRY_ENVIRONMENT=development\nSENTRY_RELEASE=app@1.0.0`;
  }

  private getLoggingSection(): string {
    return `# --- Logging (Pino) ---\nLOG_LEVEL=debug\nLOG_PRETTY_PRINT=true\nLOG_DESTINATION=stdout\nLOG_FILE_PATH=logs/app.log`;
  }
}