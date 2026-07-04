import { AppBuilder, INJECTION_TOKENS, LOG_LEVEL, TokenHelper } from '@xeno/core'
import type { IServiceContainer, ICommand, IHandler, IQuery } from '@xeno/core'
import { ERROR_CONTROLLER_TOKEN, PING_CONTROLLER_TOKEN, STATUS_CONTROLLER_TOKEN, UNAUTHORIZED_CONTROLLER_TOKEN } from './tokens'
import { PingCommandHandler, UnauthorizedCommandHandler } from './cqrs/command.handler'
import { GetStatusQueryHandler } from './cqrs/query.handler'
import { ErrorController, PingController, StatusController, UnauthorizedController } from './controllers/controller'

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
            config.commandBus.idempotency = { lockTtlSeconds: 30, processedTtlSeconds: 60 }
            config.queryBus.isEnabled = true
        })
        .addLogger((config) => {
            config.level = LOG_LEVEL.DEBUG
            config.console = true
        })
        .addServices((services) => {
            services.addTransient(TokenHelper.createToken<IHandler<ICommand<{ echoed: string }>, { echoed: string }>>('PingCommand'), PingCommandHandler)
            services.addTransient(TokenHelper.createToken<IHandler<IQuery<{ status: string; uptime: number }>, { status: string; uptime: number }>>('GetStatusQuery'), GetStatusQueryHandler)
            services.addTransientFactory(TokenHelper.createToken<IHandler<ICommand<null>, null>>('UnauthorizedAccessCommand'), (c) => {
                const userStrategy = c.resolve(INJECTION_TOKENS.USER_AUTHORIZATION_PIPELINE)
                const tenantStrategy = c.resolve(INJECTION_TOKENS.TENANT_AUTHORIZATION_PIPELINE)
                return new UnauthorizedCommandHandler(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), [userStrategy, tenantStrategy])
            })

            services.addTransientFactory(PING_CONTROLLER_TOKEN, (c) => {
                return new PingController(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), c.resolve(INJECTION_TOKENS.MEDIATOR))
            })

            services.addTransientFactory(STATUS_CONTROLLER_TOKEN, (c) => {
                return new StatusController(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), c.resolve(INJECTION_TOKENS.MEDIATOR))
            })

            services.addTransient(ERROR_CONTROLLER_TOKEN, ErrorController, [INJECTION_TOKENS.REQUEST_CONTEXT, INJECTION_TOKENS.MEDIATOR])
            
            services.addTransient(UNAUTHORIZED_CONTROLLER_TOKEN, UnauthorizedController, [INJECTION_TOKENS.REQUEST_CONTEXT, INJECTION_TOKENS.MEDIATOR])
        })

    return await builder.build()
}
