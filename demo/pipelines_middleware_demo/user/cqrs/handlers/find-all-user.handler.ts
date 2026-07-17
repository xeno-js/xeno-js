import { BaseHandler, IFactory, IReadDao, Result, ResultType, UserContext } from "@xeno/core"
import { FindAllUsersQuery } from "../query/user.query"
import { User } from "../../entity/user";

export class FindAllUsersQueryHandler extends BaseHandler<FindAllUsersQuery, User[]> {
    constructor(
        private readonly _query: IReadDao<User>,
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory)
    }

    public async handle(_request: FindAllUsersQuery, signal: AbortSignal): Promise<ResultType<User[]>> {
        console.log(`[CQRS: Query] 🔵 Received FindAllUsersQuery.`)

        const ctx = this._getCurrentContext() // Retrieve the current user context, which includes userId and tenantId. This context is essential for executing the query within the correct scope.

        const result = await this._query.findAll(ctx, signal)

        if (!result.isOk()) {
            return Result.fail(result.getErrorOrThrow())
        }

        const users = result.getValueOrThrow()
        return Result.ok(users)
    }
}