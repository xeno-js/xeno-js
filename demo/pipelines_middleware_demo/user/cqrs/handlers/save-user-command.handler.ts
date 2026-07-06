import { BaseHandler, ExecutionContext, IRepository, IRequestContext, IStrategy, Result, type ResultType, StringHelper, Optional } from "@xeno/core"

import { SaveUserCommand } from "../commands/user.command"
import { User } from "../../entity/user"

export class SaveUserCommandHandler extends BaseHandler<SaveUserCommand, void> {
    constructor(
        private readonly _repository: IRepository<User>,
        requestContext: IRequestContext<ExecutionContext>,
        strategies: IStrategy<SaveUserCommand>[] = []//In a real-world scenario, you might want to inject specific strategies for handling the SaveUserCommand, such as validation or logging strategies.
    ) {
        super(requestContext, strategies)
    }

    public async handle(request: SaveUserCommand, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
        console.log(`[CQRS: Command] 🟢 Received SaveUserCommand "${StringHelper.safeStringify(request.payload)}"`)

        const user = new User(request.payload) // In a real-world scenario, you might want to perform additional validation or transformation on the payload before creating the User entity. - Use Factory methods or Builders for complex entity creation if needed and the value object pattern for complex payloads.

        const result = await this._repository.save(user, signal)

        if (!result.isOk()) {
            return Result.fail(result.getErrorOrThrow())
        }

        return result
    }
}