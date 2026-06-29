import { AppBuilder, INJECTION_TOKENS, TokenHelper } from '@graviton5'
import type { IServiceContainer, ICommand, IHandler, IQuery } from '@graviton5'
import { PING_CONTROLLER_TOKEN, STATUS_CONTROLLER_TOKEN } from './tokens'
import { PingCommandHandler } from './cqrs/command.handler'
import { GetStatusQueryHandler } from './cqrs/query.handler'
import { PingController, StatusController } from './controllers/controller'

// ─────────────────────────────────────────────────────────────────────────────
// BOOTSTRAP FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function bootstraps the application by configuring the AppBuilder with necessary middlewares, pipeline settings, and service registrations. It sets up the command and query handlers, as well as the controllers for handling HTTP requests. The function returns a promise that resolves to an IServiceContainer, which can be used to resolve services and dependencies throughout the application.
export async function bootstrap(): Promise<IServiceContainer> {
    const builder = new AppBuilder()

    builder
        .addMiddlewares()
        .addPipeline((config) => {
            config.queryBus.isEnabled = true
        })
        .addServices((services) => {
            services.addTransient(TokenHelper.createToken<IHandler<ICommand<{ echoed: string }>, { echoed: string }>>('PingCommand'), PingCommandHandler, [])
            services.addTransient(TokenHelper.createToken<IHandler<IQuery<{ status: string; uptime: number }>, { status: string; uptime: number }>>('GetStatusQuery'), GetStatusQueryHandler, [])

            services.addTransientFactory(PING_CONTROLLER_TOKEN, (c) => {
                return new PingController(c.resolve(INJECTION_TOKENS.MEDIATOR))
            })

            services.addTransientFactory(STATUS_CONTROLLER_TOKEN, (c) => {
                return new StatusController(c.resolve(INJECTION_TOKENS.MEDIATOR))
            })
        })

    return await builder.build()
}
