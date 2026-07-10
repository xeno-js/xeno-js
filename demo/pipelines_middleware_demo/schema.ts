import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// ─────────────────────────────────────────────────────────────────────────────
// DRIZZLE SCHEMA DEFINITION
// ─────────────────────────────────────────────────────────────────────────────
// This is a simple Drizzle schema definition for a "users" table. It includes an auto-incrementing primary key, a name, an email (which must be unique), and a timestamp for when the record was created.

/**
 * @description The usersTable constant defines the schema for the "users" table in a PostgreSQL database using Drizzle ORM. It includes columns for id, name, email, and createdAt, with appropriate data types and constraints. The UserDto type is inferred from the schema and represents the shape of data that can be inserted into the "users" table.
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text('user_id').notNull(),
  tenantId: text('tenant_id').notNull()
})

export type UserDto = typeof users.$inferInsert

export type FullSchema = {
  users: UserDto
  // Add other tables here as needed
}