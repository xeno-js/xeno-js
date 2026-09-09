import { XenoRegistry } from '@xeno-js/core'
import type { BaseController, ICommand, Repository, IWriteDataSource, IMapper, BaseHandler } from '@xeno-js/core'
import { User, UserProps } from './user/entity/user'
import { type FullSchema, UserDto } from './schema'
import { SaveUserCommand, UpdateUserCommand } from './user/cqrs/commands/user.command'
import { IUserReadRepository } from './user/repositories/user-read.repository'
import { IUserDataSource } from './user/datasources/user.read-datasource'
import { FindAllUsersQuery, UserQuery } from './user/cqrs/query/user.query'

// ─────────────────────────────────────────────────────────────────────────────
// Registry Tokens
// ─────────────────────────────────────────────────────────────────────────────
// This file defines the 'Injection Tokens' for the Dependency Injection system. A registry entry is a unique identifier (usually a Symbol) used by the Xeno container to resolve dependencies in a type-safe and decoupled manner.
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE:
// 1. Define your registry entry:
// export interface MyRegistry extends XenoRegistry<{ /** Your Db Schema here **/}> {
//      /** Your services here <string, class> **/
//      MY_SERVICE: MyService
// }
export interface MyRegistry extends XenoRegistry<FullSchema> {
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
}