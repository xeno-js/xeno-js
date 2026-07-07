import { AppBuilder, INJECTION_TOKENS, LOG_LEVEL, TokenHelper } from '@xeno/core'
import type { IServiceContainer, IHandler, ICommand } from '@xeno/core'
import { USER_REPOSITORY, USER_READ_REPOSITORY, USER_DS_TOKEN, USER_READ_DS_TOKEN, USER_MAPPER_TOKEN, UNAUTHORIZED_CONTROLLER_TOKEN, SAVE_USER_CONTROLLER_TOKEN, FIND_USER_CONTROLLER_TOKEN, UPDATE_USER_COMMAND_HANDLER_TOKEN, UPDATE_USER_CONTROLLER_TOKEN } from './tokens'
import { SaveUserCommandHandler, FindUserQueryHandler, UpdateUserCommandHandler } from './user/cqrs/handlers/index'
import { UnauthorizedCommandHandler } from './unauthorized/handlers/unauthorized.handler'
import { SaveUserController, FindUserController, UpdateUserController } from './user/controllers/index'
import { UnauthorizedController } from './unauthorized/controllers/unauthorized.controller'
import { SaveUserCommand } from './user/cqrs/commands/user.command'
import { User } from './user/entity/user'
import { UserQuery } from './user/cqrs/query/user.query'
import { UserMapper } from './user/mappers/user.mapper'
import { UserDataSource } from './user/datasources/user.datasource'
import { UserReadDatasource } from './user/datasources/user.read-datasource'
import { UserReadRepository } from './user/repositories/user-read.repository'
import { UserWriteRepository } from './user/repositories/user-write.repository'

// ─────────────────────────────────────────────────────────────────────────────
// DEMO BOOTSTRAP FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function bootstraps the application by configuring the AppBuilder with necessary middlewares, pipeline settings, and service registrations. It sets up the command and query handlers, as well as the controllers for handling HTTP requests. The function returns a promise that resolves to an IServiceContainer, which can be used to resolve services and dependencies throughout the application.
export async function bootstrap(): Promise<IServiceContainer> {
    const builder = new AppBuilder()

    builder
        .addContext()
        .addMiddlewares()
        .addPipeline((config) => {
            config.authorization.isEnabled = true
            config.authorization.tenant = true
            config.authorization.policies = {
                'UnauthorizedAccessCommand': {
                    roles: ['guest'],
                    permissions: ['read', 'write'],
                },
                'SaveUserCommand': {
                    roles: ['guest'],
                },
                'UserQuery': {
                    permissions: ['read'],
                },
            }
            config.commandBus.idempotency = { lockTtlSeconds: 30, processedTtlSeconds: 60 }
            config.queryBus.isEnabled = true
        })
        .addDb((opts) => {
            if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing!')
            opts.connectionString = process.env.DATABASE_URL
        })
        .addAuth((config) => {
            config.key = 'demo-key'
            config.url = 'https://demo-auth-server.com'
        })
        .addLogger((config) => {
            config.level = LOG_LEVEL.INFO
            config.console = true
        })
        .addServices((services) => {
            // REGISTER MAPPER
            services.addScoped(USER_MAPPER_TOKEN, UserMapper)

            // REGISTER DATASOURCES
            services.addScoped(USER_DS_TOKEN, UserDataSource, [INJECTION_TOKENS.DB_CONTEXT])
            services.addScoped(USER_READ_DS_TOKEN, UserReadDatasource, [INJECTION_TOKENS.DB_CONTEXT])

            // REGISTER REPOSITORIES
            services.addScoped(USER_REPOSITORY, UserWriteRepository, [USER_DS_TOKEN, USER_MAPPER_TOKEN])
            services.addScoped(USER_READ_REPOSITORY, UserReadRepository, [USER_READ_DS_TOKEN, USER_MAPPER_TOKEN])

            // REGISTER HANDLERS
            services.addScopedFactory(TokenHelper.createToken<IHandler<SaveUserCommand, void>>('SaveUserCommand'), (c) => {
                const requestcontext = c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT)
                const repository = c.resolve(USER_REPOSITORY)
                return new SaveUserCommandHandler(repository, requestcontext)
            })
            services.addScoped(TokenHelper.createToken<IHandler<UserQuery, User>>('UserQuery'), FindUserQueryHandler, [USER_READ_REPOSITORY, INJECTION_TOKENS.REQUEST_CONTEXT])
            services.addScopedFactory(TokenHelper.createToken<IHandler<ICommand<null, null>, null>>('UnauthorizedAccessCommand'), (c) => {
                const userStrategy = c.resolve(INJECTION_TOKENS.USER_AUTHORIZATION_PIPELINE)
                const tenantStrategy = c.resolve(INJECTION_TOKENS.TENANT_AUTHORIZATION_PIPELINE)
                return new UnauthorizedCommandHandler(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), [userStrategy, tenantStrategy])
            })
            services.addScopedFactory(UPDATE_USER_COMMAND_HANDLER_TOKEN, (c) => {
                const requestcontext = c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT)
                const repository = c.resolve(USER_REPOSITORY)
                const uow = c.resolve(INJECTION_TOKENS.UNIT_OF_WORK)
                return new UpdateUserCommandHandler(uow, repository, requestcontext)
            })

            // REGISTER CONTROLLERS
            services.addTransientFactory(SAVE_USER_CONTROLLER_TOKEN, (c) => {
                return new SaveUserController(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), c.resolve(INJECTION_TOKENS.MEDIATOR))
            })
            services.addTransientFactory(FIND_USER_CONTROLLER_TOKEN, (c) => {
                return new FindUserController(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), c.resolve(INJECTION_TOKENS.MEDIATOR))
            })
            services.addTransientFactory(UPDATE_USER_CONTROLLER_TOKEN, (c) => {
                return new UpdateUserController(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), c.resolve(INJECTION_TOKENS.MEDIATOR))
            })
            services.addTransient(UNAUTHORIZED_CONTROLLER_TOKEN, UnauthorizedController, [INJECTION_TOKENS.REQUEST_CONTEXT, INJECTION_TOKENS.MEDIATOR])
        })

    return await builder.build()
}
