import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './examples/demo-01-database/schema.ts',
  out: './drizzle', // Dir where migration files will be generated
  dbCredentials: {
    wranglerConfigPath: process.env.DATABASE_URL!,
    dbName: process.env.DATABASE_NAME!,
  },
  verbose: true,
  strict: true,
})