import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';
import { FileUtils } from '../utils/file.utils';

/**
 * @class DrizzleSqlLiteGenerator
 * @description Generates a Drizzle configuration file (drizzle.config.ts) and a
 * SQLite schema example (src/infrastructure/db/sqlite-schema.ts) when the user
 * opts to use SQLite/libSQL instead of Postgres.
 */
export class DrizzleSqlLiteGenerator implements IGenerator {
  shouldGenerate(options: ScaffoldingOptions): boolean {
    return !options.database && options.sqlLite;
  }

  async generate(projectPath: string, _options: ScaffoldingOptions): Promise<void> {
    const configContent = this.composeDrizzleConfig();
    const filePath = path.join(projectPath, 'drizzle.config.ts');
    await FileUtils.writeFileRecursive(filePath, configContent);

    const schemaPath = path.join(projectPath, 'src', 'infrastructure', 'db', 'sqlite-schema.ts');
    const schemaContent = this.composeSchema();
    await FileUtils.writeFileRecursive(schemaPath, schemaContent);
  }

  private composeDrizzleConfig(): string {
    return `import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit configuration for SQLite / libSQL.
 * Uses environment variable SQLITE_DATABASE_URL to locate the database.
 */
export default defineConfig({
  schema: './src/infrastructure/db/sqlite-schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.SQLITE_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
`;
  }

  private composeSchema(): string {
    return `import { sqliteTable, integer, text } from 'drizzle-orm/libsql';

/**
 * Example SQLite schema using Drizzle's libsql primitives.
 * Place your application tables here (this file is scaffolded by the CLI when
 * the user opts into SQLite support).
 */
export const tenantsTable = sqliteTable('tenants', {
  id: integer('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
});

export type SqliteSchema = {
  tenants: typeof tenantsTable;
};
`;
  }
}
