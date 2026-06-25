import { HardDeleteDataSource, TokenHelper } from '@gear5/core'
import type { IFilterBuilder } from '@gear5/core'
import { SQL } from 'drizzle-orm'
import { UserDto } from './schema'

// ─────────────────────────────────────────────────────────────────────────────
// INJECTION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// This file defines injection tokens for the User DataSource and the Filter Builder. These tokens are used for dependency injection, allowing for the registration and resolution of services in a decoupled manner. The tokens are created using the TokenHelper utility, which ensures type safety and uniqueness of the tokens within the application context.
export const USER_DS_TOKEN = TokenHelper.createToken<HardDeleteDataSource<UserDto, SQL | undefined>>('USER_DATA_SOURCE')
export const FILTER_BUILDER_TOKEN = TokenHelper.createToken<IFilterBuilder<SQL | undefined, string[] | undefined>>('FILTER_BUILDER')