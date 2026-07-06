import { AppError, BaseHandler, ExecutionContext, GuidHelper, IQuery, IReadDao, IRequestContext, IStrategy, Result, ResultType } from "@xeno/core"
import { UserQuery } from "../query/user.query"
import { User } from "../../entity/user";

export class FindUserQueryHandler extends BaseHandler<IQuery<{ id: string }>, User> {
    constructor(
        private readonly _query: IReadDao<User>,
        requestContext: IRequestContext<ExecutionContext>,
        strategies: IStrategy<UserQuery>[] = [] //In a real-world scenario, you might want to inject specific strategies for handling the UserQuery, such as caching or logging strategies.
    ) {
        super(requestContext, strategies)
    }

    public async handle(request: UserQuery, signal: AbortSignal): Promise<ResultType<User>> {
        console.log(`[CQRS: Query] 🔵 Received UserQuery. ID: ${request.payload.id}`)

        // Create a context object with userId and tenantId, generating new GUIDs if they are not present
        // This ensures that the query is executed within the correct user context
        // In a real-world scenario, if userId or tenantId are not present, you might want to handle this case differently, such as throwing an error or returning a specific result
        const ctx = {
            userId: GuidHelper.generate(),
            tenantId: GuidHelper.generate()
        }

        const result = await this._query.findById(request.payload.id, ctx, signal)

        if(!result.isOk()) {
            return Result.fail(result.getErrorOrThrow())
        }

        const user = result.getValueOrThrow()
        if(!user) {
            return Result.fail(AppError.notFound(this.constructor.name, `User with id ${request.payload.id} not found.`))
        }
        return Result.ok(user)
    }
}