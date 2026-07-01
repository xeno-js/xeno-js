import { UserFilterBuilder } from './filter-builder'
import { AppBuilder, INJECTION_TOKENS, HardDeleteDataSource } from '@xeno/core'
import type { DbConfig, IServiceContainer } from '@xeno/core'
import { usersTable, UserDto } from './schema'
import { SQL } from 'drizzle-orm'
import { USER_DS_TOKEN, FILTER_BUILDER_TOKEN } from './tokens'

// ─────────────────────────────────────────────────────────────────────────────
// BOOTSTRAP FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function sets up the application by configuring the database connection, registering a custom data source, and preparing the dependency injection container. It ensures that the necessary components are available for performing database operations in a clean and maintainable manner.
export async function bootstrap(): Promise<IServiceContainer> {
    const builder = new AppBuilder()

    // A. DATABASE MODULE CONFIGURATION
    builder.addDb((opts: DbConfig) => {
        if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing!')
        opts.connectionString = process.env.DATABASE_URL
        opts.tables = { users: usersTable }
    })

    // B. REGISTRATION OF OUR CUSTOM DATASOURCE IN THE CONTAINER
    // Register the filter builder as a singleton in the container
    builder.addServices((services) => {
        services.addSingleton(FILTER_BUILDER_TOKEN, UserFilterBuilder, [])
        services.addTransientFactory(USER_DS_TOKEN, (c) => {
            const dbClient = c.resolve(INJECTION_TOKENS.DB_CLIENT)
            return new HardDeleteDataSource<UserDto, SQL | undefined>(dbClient, 'users', c.resolve(FILTER_BUILDER_TOKEN))
        })
    })

    // C. BUILD THE CONTAINER (WHICH WILL INVOKE THE DB MODULE FACTORY)
    return await builder.build()
}
