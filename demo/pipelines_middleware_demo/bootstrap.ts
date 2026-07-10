import { AppBuilder, LOG_LEVEL } from '@xeno/core'
import { SaveUserCommandHandler, FindUserQueryHandler, UpdateUserCommandHandler } from './user/cqrs/handlers/index'
import { UnauthorizedCommandHandler } from './unauthorized/handlers/unauthorized.handler'
import { SaveUserController, FindUserController, UpdateUserController, FindAllUserController } from './user/controllers/index'
import { UnauthorizedController } from './unauthorized/controllers/unauthorized.controller'
import { UserMapper } from './user/mappers/user.mapper'
import { UserDataSource } from './user/datasources/user.datasource'
import { UserReadDatasource } from './user/datasources/user.read-datasource'
import { UserReadRepository } from './user/repositories/user-read.repository'
import { UserWriteRepository } from './user/repositories/user-write.repository'
import { FindAllUsersQueryHandler } from './user/cqrs/handlers/find-all-user.handler'
import type { MyRegistry } from './tokens'

// ─────────────────────────────────────────────────────────────────────────────
// DEMO BOOTSTRAP FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function bootstraps the application by configuring the AppBuilder with necessary middlewares, pipeline settings, and service registrations. It sets up the command and query handlers, as well as the controllers for handling HTTP requests. The function returns a promise that resolves to an IServiceContainer, which can be used to resolve services and dependencies throughout the application.
export const xeno = new AppBuilder<MyRegistry>()
        .addContext()
        .addMiddlewares(opts => {
            opts.publicRoutes = {
                '/api/user': { GET: 'isPublic', POST: 'isPublic', PATCH: 'isPublic', DELETE: 'isPublic', PUT: 'isPublic', HEAD: 'isPublic', OPTIONS: 'isPublic' },
                '/api/user/:id': { GET: 'isPublic', POST: 'isPublic', PATCH: 'isPublic', DELETE: 'isPublic', PUT: 'isPublic', HEAD: 'isPublic', OPTIONS: 'isPublic' },
            }
        })
        .addPipeline((config) => {
            config.authorization.userId = true
            config.authorization.tenantId = true
            config.authorization.policies = {
                'UNAUTHORIZED_COMMAND_HANDLER_TOKEN': {
                    roles: ['guest'],
                    permissions: ['read', 'write'],
                },
                'SAVE_USER_COMMAND_HANDLER_TOKEN': {
                    roles: ['guest'],
                },
                'FIND_USER_QUERY_HANDLER_TOKEN': {
                    permissions: ['read'],
                },
            }
            config.commandBus.idempotency = { lockTtlSeconds: 30, processedTtlSeconds: 60 }
            config.commandBus.concurrency = { delayConfig: { baseDelayMs: 100, maxJitterMs: 500 }, maxRetries: 3 }
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
            services.addScoped('USER_MAPPER_TOKEN', () => new UserMapper())

            // REGISTER DATASOURCES
            services.addScoped('USER_DS_TOKEN', (c) => new UserDataSource(c.resolve('DB_CONTEXT')))
            services.addScoped('USER_READ_DS_TOKEN', (c) => new UserReadDatasource(c.resolve('DB_CONTEXT')))

            // REGISTER REPOSITORIES
            services.addScoped('USER_REPOSITORY', (c) => new UserWriteRepository(c.resolve('USER_DS_TOKEN'), c.resolve('USER_MAPPER_TOKEN')))
            services.addScoped('USER_READ_REPOSITORY', (c) => new UserReadRepository(c.resolve('USER_READ_DS_TOKEN'), c.resolve('USER_MAPPER_TOKEN')))

            // REGISTER HANDLERS
            services.addScoped('SAVE_USER_COMMAND_HANDLER_TOKEN', (c) => {
                const requestcontext = c.resolve('USER_CONTEXT_FACTORY')
                const repository = c.resolve('USER_REPOSITORY')
                return new SaveUserCommandHandler(repository, requestcontext)
            })
            services.addScoped('FIND_USER_QUERY_HANDLER_TOKEN', (c) => {
                const requestcontext = c.resolve('USER_CONTEXT_FACTORY')
                const repository = c.resolve('USER_READ_REPOSITORY')
                return new FindUserQueryHandler(repository, requestcontext)
            })
            services.addScoped('FIND_ALL_USERS_QUERY_HANDLER_TOKEN', (c) => {
                const requestcontext = c.resolve('USER_CONTEXT_FACTORY')
                const repository = c.resolve('USER_READ_REPOSITORY')
                return new FindAllUsersQueryHandler(repository, requestcontext)
            })
            services.addScoped('UNAUTHORIZED_COMMAND_HANDLER_TOKEN', (c) => {
                return new UnauthorizedCommandHandler(c.resolve('USER_CONTEXT_FACTORY'))
            })
            services.addScoped('UPDATE_USER_COMMAND_HANDLER_TOKEN', (c) => {
                const requestcontext = c.resolve('USER_CONTEXT_FACTORY')
                const repository = c.resolve('USER_REPOSITORY')
                const uow = c.resolve('UNIT_OF_WORK')
                return new UpdateUserCommandHandler(uow, repository, requestcontext)
            })

            // REGISTER CONTROLLERS
            services.addTransient('SAVE_USER_CONTROLLER_TOKEN', (c) => {
                return new SaveUserController(c.resolve('CONTEXT_ACCESSOR'), c.resolve('MEDIATOR'))
            })
            services.addTransient('FIND_USER_CONTROLLER_TOKEN', (c) => {
                return new FindUserController(c.resolve('CONTEXT_ACCESSOR'), c.resolve('MEDIATOR'))
            })
            services.addTransient('UPDATE_USER_CONTROLLER_TOKEN', (c) => {
                return new UpdateUserController(c.resolve('CONTEXT_ACCESSOR'), c.resolve('MEDIATOR'))
            })
            services.addTransient('UNAUTHORIZED_CONTROLLER_TOKEN', (c) => new UnauthorizedController(c.resolve('CONTEXT_ACCESSOR'), c.resolve('MEDIATOR')))
            services.addTransient('FIND_ALL_USERS_QUERY_CONTROLLER_TOKEN', (c) => new FindAllUserController(c.resolve('CONTEXT_ACCESSOR'), c.resolve('MEDIATOR')))
        })