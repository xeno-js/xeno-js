import { BaseController, ResponseDto, STATUS_CODES } from '@xeno/core'
import { UserQuery } from '../cqrs/query/user.query'
import { User } from '../entity/user'

export class FindUserController extends BaseController<{id: string}, User> {
    public async handle(request: { id: string}): Promise<ResponseDto<User>> {
        const query = new UserQuery({ id: request.id })
        const result = await this._query(query)

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), `User with id: "${request.id}" not found`)
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.OK) // 200 OK
    }
}