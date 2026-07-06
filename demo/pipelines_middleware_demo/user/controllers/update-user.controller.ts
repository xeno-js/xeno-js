import { BaseController, ResponseDto, STATUS_CODES } from '@xeno/core'
import { UserProps } from '../entity/user'
import { UpdateUserCommand } from '../cqrs/commands/user.command'

export class UpdateUserController extends BaseController<UserProps & { id: string }, void> {
    public async handle(request: UserProps & { id: string }): Promise<ResponseDto<void>> {
        const command = new UpdateUserCommand(request)

        const result = await this._send(command)
        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Transaction failed')
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.OK) // 200 OK
    }
}
