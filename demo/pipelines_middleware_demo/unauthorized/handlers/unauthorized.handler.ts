import { BaseHandler, AppError, ICommand, Result, type ResultType, Optional } from "@xeno/core"

export class UnauthorizedCommandHandler extends BaseHandler<ICommand<null>, null> {
    public async handle(request: ICommand<null>, _signal: Optional<AbortSignal>): Promise<ResultType<null>> {
        console.log(`[CQRS: Command] 🟢 Received UnauthorizedCommand with intent: "${request.intent}"`)

        // In a real-world scenario, you might want to log this event or trigger an alert for unauthorized access attempts.
        
        return Result.ok(null)
    }
}