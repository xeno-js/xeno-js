import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// ─────────────────────────────────────────────────────────────────────────────
// 1. DRIZZLE SCHEMA DEFINITION
// ─────────────────────────────────────────────────────────────────────────────
// This is a simple Drizzle schema definition for a "users" table. It includes an auto-incrementing primary key, a name, an email (which must be unique), and a timestamp for when the record was created.
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})

export type UserDto = typeof usersTable.$inferInsert