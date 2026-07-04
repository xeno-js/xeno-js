import { BaseHandler } from "@/application"
import { AppError, ICommand, IHandler, Result, type ResultType } from "@/domain"
import { PingCommand } from "./command"

export class PingCommandHandler implements IHandler<ICommand<{ echoed: string }>, { echoed: string }> {
    public async handle(request: PingCommand, _signal?: AbortSignal): Promise<ResultType<{ echoed: string }>> {
        console.log(`[CQRS: Command] 🟢 Received PingCommand with message: "${request.message}"`)

        return Result.ok({ echoed: request.message })
    }
}

export class UnauthorizedCommandHandler extends BaseHandler<ICommand<null>, null> {
    public async handle(request: ICommand<null>, _signal?: AbortSignal): Promise<ResultType<null>> {
        console.log(`[CQRS: Command] 🟢 Received UnauthorizedCommand with intent: "${request.intent}"`)

        const { userId, tenantId } = await this._getCurrentUser(request)
        if(!userId || !tenantId) {
            return Result.fail(
                AppError.unauthorized('UnauthorizedCommandHandler', 'User is not authorized to perform this action.')
            )
        }
        return Result.ok(null)
    }
}
