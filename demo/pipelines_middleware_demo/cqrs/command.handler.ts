import { BaseHandler, AppError, ExecutionContext, ICommand, IHandler, IRepository, IRequestContext, IStrategy, Result, GuidHelper, type ResultType, StringHelper } from "@xeno/core"

import { UserCommand } from "./command"
import { User } from "../entity/user"

export class UserCommandHandler extends BaseHandler<UserCommand, void> {
    constructor(
        private readonly _repository: IRepository<User>,
        requestContext: IRequestContext<ExecutionContext>,
        strategies: IStrategy<UserCommand>[] = []//In a real-world scenario, you might want to inject specific strategies for handling the UserCommand, such as validation or logging strategies.
    ) {
        super(requestContext, strategies)
    }

    public async handle(request: UserCommand, signal: AbortSignal): Promise<ResultType<void>> {
        console.log(`[CQRS: Command] 🟢 Received UserCommand "${StringHelper.safeStringify(request.payload)}"`)

        const user = new User(request.payload)

        const result = await this._repository.save(user, signal)

        if(!result.isOk()) {
            return Result.fail(result.getErrorOrThrow())
        }

        return result
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