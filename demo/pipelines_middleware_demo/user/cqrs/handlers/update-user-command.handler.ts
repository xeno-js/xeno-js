import { BaseHandler, AppError, ExecutionContext, Guards, IRepository, IRequestContext, IStrategy, Result, type ResultType, IUnitOfWork, Optional, GuidHelper, ERROR_CODES, STATUS_CODES } from "@xeno/core"

import { User } from "../../entity/user"
import { UpdateUserCommand } from "../commands/user.command"

export class UpdateUserCommandHandler extends BaseHandler<UpdateUserCommand, void> {
    constructor(
        private readonly _uow: IUnitOfWork,
        private readonly _repository: IRepository<User>,
        requestContext: IRequestContext<ExecutionContext>,
        strategies: IStrategy<UpdateUserCommand>[] = []//In a real-world scenario, you might want to inject specific strategies for handling the UpdateUserCommand, such as validation or logging strategies.
    ) {
        super(requestContext, strategies)
    }
    public async handle(request: UpdateUserCommand, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
        console.log(`[CQRS: Command] 🟢 Received UpdateUserCommand with intent: "${request.intent}"`)
        const result = await this._uow.runInTransaction(async () => {
            const ctx = {
                userId: GuidHelper.generate(), // In a real-world scenario, you would retrieve the actual user ID from the request context or authentication token.
                tenantId: GuidHelper.generate(), // In a real-world scenario, you would retrieve the actual tenant ID from the request context or authentication token.
            }
            const result = await this._repository.findById(request.payload.id, ctx, signal)
            if (!result.isOk() || !Guards.isDefined(result.getValueOrThrow()))
                AppError.throw({
                    code: ERROR_CODES.NOT_FOUND,
                    message: 'User not found.',
                    status: STATUS_CODES.NOT_FOUND,
                    cause: new Error('User with ID 3 does not exist.'),
                    name: 'UpdateUserCommandHandler'
            })

            const userEntity = result.getValueOrThrow()

            const partial = new User({
                ...userEntity!.getProps(),
                ...request.payload // Merge the existing properties with the new properties from the request payload
            })

            await this._repository.update(request.payload.id, partial, ctx, signal)
            // Simulate an error to test transaction rollback
            // Uncomment the following lines to simulate an error and test transaction rollback
            // AppError.throw({
            //     code: ERROR_CODES.SYSTEM_ERROR,
            //     message: 'Simulated error to test transaction rollback.',
            //     status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            //     cause: new Error('This is a simulated error for testing purposes.'),
            //     name: 'UpdateUserCommandHandler'
            // })
        }, signal)

        return Result.ok(result)
    }
}