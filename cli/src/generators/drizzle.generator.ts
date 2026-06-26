import fs from 'node:fs/promises';
import path from 'node:path';
import { IGenerator, ScaffoldingOptions } from '../core/generator.interface';

export class DrizzleGenerator implements IGenerator {
  shouldGenerate(options: ScaffoldingOptions): boolean {
    return options.database; // Genera solo se l'utente ha scelto il database
  }

  async generate(projectPath: string, options: ScaffoldingOptions): Promise<void> {
    const configContent = this.composeDrizzleConfig();
    await fs.writeFile(path.join(projectPath, 'drizzle.config.ts'), configContent);

    const schemaContent = this.composeSchema();
    await fs.writeFile(path.join(projectPath, 'src', 'schema.ts'), schemaContent);
  }

  private composeDrizzleConfig(): string {
    return `import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit configuration file.
 * Defines the schema location, migration output directory, and database connection.
 */
export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
`;
  }

  private composeSchema(): string {
    return `import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * @description Define your database tables here.
 * The 'usersTable' serves as a baseline example. 
 * You can add more tables, relations, and indexes according to your domain requirements.
 */
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Types inferred from the schema.
 * - UserDto: Represents the shape of the data retrieved from the database ($inferSelect).
 * - NewUserDto: Represents the shape of the data required to insert a new record ($inferInsert).
 */
export type UserDto = typeof usersTable.$inferSelect;
export type NewUserDto = typeof usersTable.$inferInsert;
`;
  }
}