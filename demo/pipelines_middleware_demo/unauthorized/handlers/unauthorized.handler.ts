import { BaseHandler, AppError, ICommand, Result, type ResultType, Optional } from "@xeno/core"

export class UnauthorizedCommandHandler extends BaseHandler<ICommand<null>, null> {
    public async handle(request: ICommand<null>, _signal: Optional<AbortSignal>): Promise<ResultType<null>> {
        console.log(`[CQRS: Command] 🟢 Received UnauthorizedCommand with intent: "${request.intent}"`)

        await this._validateCurrent(request)

        const ctx = this._getCurrentContext()
        if (!ctx?.userId || !ctx?.tenantId) {
            return Result.fail(
                AppError.unauthorized('UnauthorizedCommandHandler', 'User is not authorized to perform this action.')
            )
        }
        return Result.ok(null)
    }
}