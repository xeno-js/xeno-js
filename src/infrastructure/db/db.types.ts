import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

import type { Dictionary } from '@/shared'

/**
 * @description Type definition for the database context used in the application. It represents an ORM database instance that is parameterized with a dictionary of schema names mapped to their corresponding table definitions. This allows for type-safe interactions with the database tables, enabling developers to perform queries, inserts, updates, and deletes while ensuring that the operations are aligned with the defined table structures. The DbContext type serves as a central point for managing database operations within the application, promoting consistency and maintainability in data access patterns.
 *
 * example usage:
 * ```ts
 * import type { DbContext } from '@xeno/core'
 *
 * private readonly _db: DbContext<{ users: PgTable }>
 * ```
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export type DbContext<TSchema extends Dictionary = Dictionary> = NodePgDatabase<TSchema>
