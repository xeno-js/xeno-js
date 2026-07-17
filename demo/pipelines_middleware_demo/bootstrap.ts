import { AppBuilder, LOG_LEVEL, TOKENS } from '@xeno/core'
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
import type { MyRegistry } from './registry'

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
        .addPipeline((opts) => {
            opts.authorization.userId = true
            opts.authorization.tenantId = true
            opts.authorization.policies = {
                'UNAUTHORIZED_COMMAND_HANDLER_TOKEN': {
                    roles: ['admin'],
                    permissions: ['read', 'write'],
                },
                'SAVE_USER_COMMAND_HANDLER_TOKEN': {
                    roles: ['guest'],
                },
                'FIND_USER_QUERY_HANDLER_TOKEN': {
                    permissions: ['read'],
                },
            }
            opts.commandBus.idempotency = { lockTtlSeconds: 30, processedTtlSeconds: 60 }
            opts.commandBus.concurrency = { delayConfig: { baseDelayMs: 100, maxJitterMs: 500 }, maxRetries: 3 }
            opts.queryBus.isEnabled = true
        })
        .addDb((opts, config) => {
            opts.connectionString = config.getOrThrow('DATABASE_URL')
        })
        .addAuth((opts) => {
            opts.key = 'demo-key'
            opts.url = 'https://demo-auth-server.com'
        })
        .addLogger((opts) => {
            opts.level = LOG_LEVEL.INFO
            opts.console = true
        })
        .addServices((services) => {
            // REGISTER MAPPER
            services.addScoped('USER_MAPPER_TOKEN', () => new UserMapper())

            // REGISTER DATASOURCES
            services.addScoped('USER_DS_TOKEN', (c) => new UserDataSource(c.resolve(TOKENS.DB_CONTEXT)))
            services.addScoped('USER_READ_DS_TOKEN', (c) => new UserReadDatasource(c.resolve(TOKENS.DB_CONTEXT)))

            // REGISTER REPOSITORIES
            services.addScoped('USER_REPOSITORY', (c) => new UserWriteRepository(c.resolve('USER_DS_TOKEN'), c.resolve('USER_MAPPER_TOKEN')))
            services.addScoped('USER_READ_REPOSITORY', (c) => new UserReadRepository(c.resolve('USER_READ_DS_TOKEN'), c.resolve('USER_MAPPER_TOKEN')))

            // REGISTER HANDLERS
            services.addScoped('SAVE_USER_COMMAND_HANDLER_TOKEN', (c) => {
                const requestcontext = c.resolve(TOKENS.USER_CONTEXT_FACTORY)
                const repository = c.resolve('USER_REPOSITORY')
                return new SaveUserCommandHandler(repository, requestcontext)
            })
            services.addScoped('FIND_USER_QUERY_HANDLER_TOKEN', (c) => {
                const requestcontext = c.resolve(TOKENS.USER_CONTEXT_FACTORY)
                const repository = c.resolve('USER_READ_REPOSITORY')
                return new FindUserQueryHandler(repository, requestcontext)
            })
            services.addScoped('FIND_ALL_USERS_QUERY_HANDLER_TOKEN', (c) => {
                const requestcontext = c.resolve(TOKENS.USER_CONTEXT_FACTORY)
                const repository = c.resolve('USER_READ_REPOSITORY')
                return new FindAllUsersQueryHandler(repository, requestcontext)
            })
            services.addScoped('UNAUTHORIZED_COMMAND_HANDLER_TOKEN', (c) => {
                return new UnauthorizedCommandHandler(c.resolve(TOKENS.USER_CONTEXT_FACTORY))
            })
            services.addScoped('UPDATE_USER_COMMAND_HANDLER_TOKEN', (c) => {
                const requestcontext = c.resolve(TOKENS.USER_CONTEXT_FACTORY)
                const repository = c.resolve('USER_REPOSITORY')
                const uow = c.resolve(TOKENS.UNIT_OF_WORK)
                return new UpdateUserCommandHandler(uow, repository, requestcontext)
            })

            // REGISTER CONTROLLERS
            services.addTransient('SAVE_USER_CONTROLLER_TOKEN', (c) => {
                return new SaveUserController(c.resolve(TOKENS.CONTEXT_ACCESSOR), c.resolve(TOKENS.MEDIATOR))
            })
            services.addTransient('FIND_USER_CONTROLLER_TOKEN', (c) => {
                return new FindUserController(c.resolve(TOKENS.CONTEXT_ACCESSOR), c.resolve(TOKENS.MEDIATOR))
            })
            services.addTransient('UPDATE_USER_CONTROLLER_TOKEN', (c) => {
                return new UpdateUserController(c.resolve(TOKENS.CONTEXT_ACCESSOR), c.resolve(TOKENS.MEDIATOR))
            })
            services.addTransient('UNAUTHORIZED_CONTROLLER_TOKEN', (c) => new UnauthorizedController(c.resolve(TOKENS.CONTEXT_ACCESSOR), c.resolve(TOKENS.MEDIATOR)))
            services.addTransient('FIND_ALL_USERS_QUERY_CONTROLLER_TOKEN', (c) => new FindAllUserController(c.resolve(TOKENS.CONTEXT_ACCESSOR), c.resolve(TOKENS.MEDIATOR)))
        })