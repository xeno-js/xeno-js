import { BaseHandler, AppError, ExecutionContext, ICommand, IRepository, IRequestContext, IStrategy, Result, type ResultType, StringHelper, IUnitOfWork, Optional, GuidHelper } from "@xeno/core"

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

    public async handle(request: UserCommand, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
        console.log(`[CQRS: Command] 🟢 Received UserCommand "${StringHelper.safeStringify(request.payload)}"`)

        const user = new User(request.payload)

        const result = await this._repository.save(user, signal)

        if (!result.isOk()) {
            return Result.fail(result.getErrorOrThrow())
        }

        return result
    }
}

export class UnauthorizedCommandHandler extends BaseHandler<ICommand<null>, null> {
    public async handle(request: ICommand<null>, _signal: Optional<AbortSignal>): Promise<ResultType<null>> {
        console.log(`[CQRS: Command] 🟢 Received UnauthorizedCommand with intent: "${request.intent}"`)

        const { userId, tenantId } = await this._getCurrentUser(request)
        if (!userId || !tenantId) {
            return Result.fail(
                AppError.unauthorized('UnauthorizedCommandHandler', 'User is not authorized to perform this action.')
            )
        }
        return Result.ok(null)
    }
}

export class UserTransactionCommandHandler extends BaseHandler<ICommand<null>, void> {
    constructor(
        private readonly _uow: IUnitOfWork,
        private readonly _repository: IRepository<User>,
        requestContext: IRequestContext<ExecutionContext>,
        strategies: IStrategy<ICommand<null>>[] = []//In a real-world scenario, you might want to inject specific strategies for handling the UserTransactionCommand, such as validation or logging strategies.
    ) {
        super(requestContext, strategies)
    }
    public async handle(request: ICommand<null>, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
        console.log(`[CQRS: Command] 🟢 Received UserTransactionCommand with intent: "${request.intent}"`)
        const result = await this._uow.runInTransaction(async () => {
            const ctx = {
                userId: GuidHelper.generate(), // Replace with actual user ID
                tenantId: GuidHelper.generate(), // Replace with actual tenant ID
            }
            const result = await this._repository.findById(3, ctx, signal)
            if (!result.isOk())
                throw new Error('User not found for update.')
            const userEntity = result.getValueOrThrow()

            const partial = new User({
                ...userEntity!.getProps(),
                name: 'Updated Name',
            })

            await this._repository.update(3, partial, ctx, signal)
        }, signal)

        return Result.ok(result)
    }
}