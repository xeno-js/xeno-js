import { XenoRegistry } from '@xeno/core'
import type { BaseController, ICommand, Repository, IWriteDataSource, IMapper, BaseHandler } from '@xeno/core'
import { User, UserProps } from './user/entity/user'
import { type FullSchema, UserDto } from './schema'
import { SaveUserCommand, UpdateUserCommand } from './user/cqrs/commands/user.command'
import { IUserReadRepository } from './user/repositories/user-read.repository'
import { IUserDataSource } from './user/datasources/user.read-datasource'
import { FindAllUsersQuery, UserQuery } from './user/cqrs/query/user.query'

// ─────────────────────────────────────────────────────────────────────────────
// INJECTION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// This file defines injection tokens for the User DataSource and the Filter Builder. These tokens are used for dependency injection, allowing for the registration and resolution of services in a decoupled manner. The tokens are created using the TokenHelper utility, which ensures type safety and uniqueness of the tokens within the application context.
export type MyRegistry = XenoRegistry<FullSchema, {
    USER_REPOSITORY: Repository<User, UserDto>
    USER_READ_REPOSITORY: IUserReadRepository
    USER_DS_TOKEN: IWriteDataSource<UserDto>
    USER_READ_DS_TOKEN: IUserDataSource
    USER_MAPPER_TOKEN: IMapper<User, UserDto>
    UNAUTHORIZED_CONTROLLER_TOKEN: BaseController<null, null>
    SAVE_USER_CONTROLLER_TOKEN: BaseController<UserProps, UserDto>
    FIND_USER_CONTROLLER_TOKEN: BaseController<{ id: string }, User>
    UPDATE_USER_CONTROLLER_TOKEN: BaseController<UserProps & { id: string }, void>
    SAVE_USER_COMMAND_HANDLER_TOKEN: BaseHandler<SaveUserCommand, void>
    FIND_USER_QUERY_HANDLER_TOKEN: BaseHandler<UserQuery, User>
    FIND_ALL_USERS_QUERY_HANDLER_TOKEN: BaseHandler<FindAllUsersQuery, User[]>
    UNAUTHORIZED_COMMAND_HANDLER_TOKEN: BaseHandler<ICommand<null>, null>
    UPDATE_USER_COMMAND_HANDLER_TOKEN: BaseHandler<UpdateUserCommand, void>
    FIND_ALL_USERS_QUERY_CONTROLLER_TOKEN: BaseController<void, User[]>
}>