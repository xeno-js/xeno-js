import { BaseHandler, IFactory, IReadDao, Result, ResultType, UserContext } from "@xeno/core"
import { UserQuery } from "../query/user.query"
import { User } from "../../entity/user";

export class FindUserQueryHandler extends BaseHandler<UserQuery, User> {
    constructor(
        private readonly _query: IReadDao<User>,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }

    public async handle(request: UserQuery, signal: AbortSignal): Promise<ResultType<User>> {
        console.log(`[CQRS: Query] 🔵 Received UserQuery. ID: ${request.id}`)

        const ctx = this._getCurrentContext() // Retrieve the current user context, which includes userId and tenantId. This context is essential for executing the query within the correct scope.

        const result = await this._query.findById(request.id, ctx, signal)

        if (!result.isOk()) {
            return Result.fail(result.getErrorOrThrow())
        }

        const user = result.getValueOrThrow()
        return Result.ok(user)
    }
}