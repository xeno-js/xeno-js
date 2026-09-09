import { BaseController, ResponseDto, STATUS_CODES } from '@xeno-js/core'
import { FindAllUsersQuery } from '../cqrs/query/user.query'
import { User } from '../entity/user'

export class FindAllUserController extends BaseController<void, User[]> {
    public async handle(request: void): Promise<ResponseDto<User[]>> {
        console.log(`[Controller] 🔵 Received request to find all users.`)
        const query = new FindAllUsersQuery()
        const result = await this._query(query)

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), `An error occurred while processing the request for all users.`, {})
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.OK) // 200 OK
    }
}