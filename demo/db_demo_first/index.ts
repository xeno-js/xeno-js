import 'dotenv/config'
import { SQL } from 'drizzle-orm'

import { AppBuilder, INJECTION_TOKENS, HardDeleteDataSource, TokenHelper, Guards } from '@gear5/core'
import type { DbConfig } from '@gear5/core'

import { usersTable, UserDto } from './schema'
import { UserFilterBuilder } from './filter-builder'
  
// ─────────────────────────────────────────────────────────────────────────────
// DEMO FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function demonstrates how to set up a database connection using the AppBuilder, register a custom data source, and perform a simple insert operation into the "users" table. It handles errors gracefully and ensures that the process exits cleanly after execution.
// ─────────────────────────────────────────────────────────────────────────────
async function runDemo() {
  console.log('🚀 Avvio Demo 01: Database e DataSource...\n')

  const builder = new AppBuilder()

  // A. DATABASE MODULE CONFIGURATION
  builder.addDb((opts: DbConfig) => {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing!')
    opts.connectionString = process.env.DATABASE_URL
    opts.tables = { users:  usersTable }
  })

  // B. REGISTRATION OF OUR CUSTOM DATASOURCE IN THE CONTAINER
  // We create a local token for this dependency
  const USER_DS_TOKEN = TokenHelper.createToken<HardDeleteDataSource<UserDto, SQL | undefined>>('USER_DATA_SOURCE')
  const FILTER_BUILDER_TOKEN = TokenHelper.createToken<UserFilterBuilder>('FILTER_BUILDER')
  // Register the filter builder as a singleton in the container
  builder.addSingleton(FILTER_BUILDER_TOKEN, UserFilterBuilder, [])
  // Register the HardDeleteDataSource as a transient service in the container
  builder.addTransientFactory(USER_DS_TOKEN, (c) => {
    const dbClient = c.resolve(INJECTION_TOKENS.DB_CLIENT)
    return new HardDeleteDataSource<UserDto, SQL | undefined>(dbClient, 'users', c.resolve(FILTER_BUILDER_TOKEN))
  })

  try {
    // C. BUILD THE CONTAINER (WHICH WILL INVOKE THE DB MODULE FACTORY)
    const container = await builder.build()
    console.log('✅ Framework configured and modules started.')

    // D. RESOLVE OUR DATASOURCE
    const userDataSource = container.resolve<HardDeleteDataSource<UserDto, SQL | undefined>>(USER_DS_TOKEN)

    // E. CREATE AN ABORT CONTROLLER FOR CANCELLATION SUPPORT
    // This is useful for long-running operations or when you want to provide a way to cancel the operation if needed.
    const abortController = new AbortController()

    // F. ACTUAL TEST
    const newUserDto: UserDto = {
      name: "Admin Demo",
      email: `demo.${Date.now()}@example.com`
    }
    // Insert the new user into the database using the data source
    await userDataSource.insert(newUserDto, abortController.signal)

    console.log('🎉 User successfully created in the Database!')

    // G. VERIFY INSERTION BY FINDING THE USER
    const findUser = await userDataSource.find({
      where: [{ field: 'email', operator: 'eq', value: newUserDto.email }],
      relationsToLoad: null
    }, abortController.signal)

    console.log('🔍 User found:', findUser)
    if(Guards.isNullOrEmpty(findUser)) {
      console.error('❌ User not found after insertion!')
      return
    }
    const savedUser = findUser[0]

    // H. DELETE THE USER
    await userDataSource.delete(savedUser, abortController.signal)
    console.log('🗑️ User deleted from the Database.')

  } catch (error) {
    console.error('❌ Error during execution:', error)
  } finally {
    process.exit(0)
  }
}

runDemo()