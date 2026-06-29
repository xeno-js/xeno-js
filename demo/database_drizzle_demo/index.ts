import 'dotenv/config'
import { SQL } from 'drizzle-orm'

import { HardDeleteDataSource, Guards } from '@graviton5'

import { UserDto } from './schema'
import { bootstrap } from './bootstrap'

import { USER_DS_TOKEN } from './tokens'
  
// ─────────────────────────────────────────────────────────────────────────────
// DEMO FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function demonstrates the usage of the HardDeleteDataSource for performing CRUD operations on a PostgreSQL database using Drizzle ORM. It bootstraps the application, resolves the data source, and performs an insert, find, and delete operation while handling potential errors and providing cancellation support through an AbortController.
// ─────────────────────────────────────────────────────────────────────────────
async function runDemo() {
  console.log('🚀 Running Demo 01: Database e DataSource...\n')

  try {
    // A. BOOTSTRAP THE APPLICATION AND GET THE SERVICE CONTAINER
    const container = await bootstrap()
    console.log('✅ Framework configured and modules started.')

    // B. RESOLVE OUR DATASOURCE
    const userDataSource = container.resolve<HardDeleteDataSource<UserDto, SQL | undefined>>(USER_DS_TOKEN)

    // C. CREATE AN ABORT CONTROLLER FOR CANCELLATION SUPPORT
    // This is useful for long-running operations or when you want to provide a way to cancel the operation if needed.
    const abortController = new AbortController()

    // D. ACTUAL TEST
    const newUserDto: UserDto = {
      name: "Admin Demo",
      email: `demo.${Date.now()}@example.com`
    }
    // Insert the new user into the database using the data source
    await userDataSource.insert(newUserDto, abortController.signal)

    console.log('🎉 User successfully created in the Database!')

    // E. VERIFY INSERTION BY FINDING THE USER
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

    // F. DELETE THE USER
    await userDataSource.delete(savedUser, abortController.signal)
    console.log('🗑️ User deleted from the Database.')

  } catch (error) {
    console.error('❌ Error during execution:', error)
  } finally {
    process.exit(0)
  }
}

runDemo()