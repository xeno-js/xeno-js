import { BaseHandler, AppError, Guards, IRepository, Result, type ResultType, IUnitOfWork, Optional, ERROR_CODES, STATUS_CODES, UserContext, IFactory } from "@xeno/core"

import { User } from "../../entity/user"
import { UpdateUserCommand } from "../commands/user.command"

export class UpdateUserCommandHandler extends BaseHandler<UpdateUserCommand, void> {
    constructor(
        private readonly _uow: IUnitOfWork,
        private readonly _repository: IRepository<User>,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }
    public async handle(request: UpdateUserCommand, signal: Optional<AbortSignal>): Promise<ResultType<void>> {
        console.log(`[CQRS: Command] 🟢 Received UpdateUserCommand with intent: "${request.intent}"`)
        const result = await this._uow.runInTransaction(async () => {
            const ctx = this._getCurrentContext() // Retrieve the current user context, which includes userId and tenantId. This context is essential for executing the command within the correct scope.

            const result = await this._repository.findById(request.props.id, ctx, signal)
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
                ...request.props // Merge the existing properties with the new properties from the request props
            })

            await this._repository.update(request.props.id, partial, ctx, signal)
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