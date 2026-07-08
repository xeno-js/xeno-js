import { TokenHelper } from '@xeno/core'
import type { BaseController, Repository, IReadDataSource, IWriteDataSource, IMapper, BaseHandler } from '@xeno/core'
import { User, UserProps } from './user/entity/user'
import { UserDto } from './schema'
import { UpdateUserCommand } from './user/cqrs/commands/user.command'
import { IUserReadRepository } from './user/repositories/user-read.repository'

// ─────────────────────────────────────────────────────────────────────────────
// INJECTION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// This file defines injection tokens for the User DataSource and the Filter Builder. These tokens are used for dependency injection, allowing for the registration and resolution of services in a decoupled manner. The tokens are created using the TokenHelper utility, which ensures type safety and uniqueness of the tokens within the application context.
export const USER_REPOSITORY = TokenHelper.createToken<Repository<User, UserDto>>('UserRepository')
export const USER_READ_REPOSITORY = TokenHelper.createToken<IUserReadRepository>('UserReadRepository')
export const USER_DS_TOKEN = TokenHelper.createToken<IWriteDataSource<UserDto>>('UserDataSource')
export const USER_READ_DS_TOKEN = TokenHelper.createToken<IReadDataSource<UserDto>>('UserReadDataSource')
export const USER_MAPPER_TOKEN = TokenHelper.createToken<IMapper<User, UserDto>>('UserMapper')
export const UNAUTHORIZED_CONTROLLER_TOKEN = TokenHelper.createToken<BaseController<null, null>>('UNAUTHORIZED_CONTROLLER_TOKEN')
export const SAVE_USER_CONTROLLER_TOKEN = TokenHelper.createToken<BaseController<UserProps, UserDto>>('SAVE_USER_CONTROLLER_TOKEN')
export const FIND_USER_CONTROLLER_TOKEN = TokenHelper.createToken<BaseController<{id: string}, User>>('FIND_USER_CONTROLLER_TOKEN')
export const UPDATE_USER_CONTROLLER_TOKEN = TokenHelper.createToken<BaseController<UserProps & { id: string }, void>>('UPDATE_USER_CONTROLLER_TOKEN')
export const UPDATE_USER_COMMAND_HANDLER_TOKEN = TokenHelper.createToken<BaseHandler<UpdateUserCommand, void>>('UpdateUserCommand')
export const FIND_ALL_USERS_QUERY_CONTROLLER_TOKEN = TokenHelper.createToken<BaseController<void, User[]>>('FIND_ALL_USERS_QUERY_CONTROLLER_TOKEN')