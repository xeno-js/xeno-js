import { ICommand, IHandler, Result } from "@/domain"
import { PingCommand } from "./command"

export class PingCommandHandler implements IHandler<ICommand<{ echoed: string }>, { echoed: string }> {
    public async handle(request: PingCommand) {
        console.log(`[CQRS: Command] 🟢 Received PingCommand with message: "${request.message}"`)

        return Result.ok({ echoed: request.message })
    }
}