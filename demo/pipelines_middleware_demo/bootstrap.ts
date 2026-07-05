import { AppBuilder, INJECTION_TOKENS, LOG_LEVEL, ReadDao, Repository, TokenHelper } from '@xeno/core'
import type { IServiceContainer, IHandler, ICommand } from '@xeno/core'
import { USER_REPOSITORY, USER_READ_REPOSITORY, USER_DS_TOKEN, USER_READ_DS_TOKEN, USER_MAPPER_TOKEN, UNAUTHORIZED_CONTROLLER_TOKEN, SAVE_USER_CONTROLLER_TOKEN, FIND_USER_CONTROLLER_TOKEN, USER_TRANSACTION_CONTROLLER_TOKEN, USER_TRANSACTION_COMMAND_HANDLER_TOKEN } from './tokens'
import { UserCommandHandler, UnauthorizedCommandHandler, UserTransactionCommandHandler } from './cqrs/command.handler'
import { UserQueryHandler } from './cqrs/query.handler'
import { SaveUserController, FindUserController, UnauthorizedController, UserTransactionController } from './controllers/controller'
import { UserCommand } from './cqrs/command'
import { User } from './entity/user'
import { UserQuery } from './cqrs/query'
import { UserMapper } from './mappers/user.mapper'
import { UserDataSource } from './datasources/user.datasource'
import { UserReadDatasource } from './datasources/user.read-datasource'

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
                    roles: ['admin'],
                    permissions: ['read', 'write'],
                },
                'UserCommand': {
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
            services.addScoped(USER_REPOSITORY, Repository, [USER_DS_TOKEN, USER_MAPPER_TOKEN])
            services.addScoped(USER_READ_REPOSITORY, ReadDao, [USER_READ_DS_TOKEN, USER_MAPPER_TOKEN])

            // REGISTER HANDLERS
            services.addScopedFactory(TokenHelper.createToken<IHandler<UserCommand, void>>('UserCommand'), (c) => {
                const requestcontext = c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT)
                const repository = c.resolve(USER_REPOSITORY)
                return new UserCommandHandler(repository, requestcontext)
            })
            services.addScoped(TokenHelper.createToken<IHandler<UserQuery, User>>('UserQuery'), UserQueryHandler, [USER_READ_REPOSITORY, INJECTION_TOKENS.REQUEST_CONTEXT])
            services.addScopedFactory(TokenHelper.createToken<IHandler<ICommand<null>, null>>('UnauthorizedAccessCommand'), (c) => {
                const userStrategy = c.resolve(INJECTION_TOKENS.USER_AUTHORIZATION_PIPELINE)
                const tenantStrategy = c.resolve(INJECTION_TOKENS.TENANT_AUTHORIZATION_PIPELINE)
                return new UnauthorizedCommandHandler(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), [userStrategy, tenantStrategy])
            })
            services.addScopedFactory(USER_TRANSACTION_COMMAND_HANDLER_TOKEN, (c) => {
                const requestcontext = c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT)
                const repository = c.resolve(USER_REPOSITORY)
                const uow = c.resolve(INJECTION_TOKENS.UNIT_OF_WORK)
                return new UserTransactionCommandHandler(uow, repository, requestcontext)
            })

            // REGISTER CONTROLLERS
            services.addTransientFactory(SAVE_USER_CONTROLLER_TOKEN, (c) => {
                return new SaveUserController(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), c.resolve(INJECTION_TOKENS.MEDIATOR))
            })
            services.addTransientFactory(FIND_USER_CONTROLLER_TOKEN, (c) => {
                return new FindUserController(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), c.resolve(INJECTION_TOKENS.MEDIATOR))
            })
            services.addTransientFactory(USER_TRANSACTION_CONTROLLER_TOKEN, (c) => {
                return new UserTransactionController(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), c.resolve(INJECTION_TOKENS.MEDIATOR))
            })
            services.addTransient(UNAUTHORIZED_CONTROLLER_TOKEN, UnauthorizedController, [INJECTION_TOKENS.REQUEST_CONTEXT, INJECTION_TOKENS.MEDIATOR])
        })

    return await builder.build()
}
