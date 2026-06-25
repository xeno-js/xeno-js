import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// ─────────────────────────────────────────────────────────────────────────────
// DRIZZLE SCHEMA DEFINITION
// ─────────────────────────────────────────────────────────────────────────────
// This is a simple Drizzle schema definition for a "users" table. It includes an auto-incrementing primary key, a name, an email (which must be unique), and a timestamp for when the record was created.

/**
 * @description The usersTable constant defines the schema for the "users" table in a PostgreSQL database using Drizzle ORM. It includes columns for id, name, email, and createdAt, with appropriate data types and constraints. The UserDto type is inferred from the schema and represents the shape of data that can be inserted into the "users" table.
 */
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})

export type UserDto = typeof usersTable.$inferInsert