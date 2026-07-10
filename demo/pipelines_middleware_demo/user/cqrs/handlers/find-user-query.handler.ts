import { BaseHandler, GuidHelper, IFactory, IReadDao, Result, ResultType, UserContext } from "@xeno/core"
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

        // Create a context object with userId and tenantId, generating new GUIDs if they are not present
        // This ensures that the query is executed within the correct user context
        // In a real-world scenario, if userId or tenantId are not present, you might want to handle this case differently, such as throwing an error or returning a specific result
        const ctx = {
            userId: GuidHelper.generate(),
            tenantId: GuidHelper.generate()
        }

        const result = await this._query.findById(request.id, ctx, signal)

        if (!result.isOk()) {
            return Result.fail(result.getErrorOrThrow())
        }

        const user = result.getValueOrThrow()
        return Result.ok(user)
    }
}