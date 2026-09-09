import { BaseController, ResponseDto, STATUS_CODES } from '@xeno-js/core'
import type { UserDto } from '../../schema'
import { SaveUserCommand } from '../cqrs/commands/user.command'
import { UserProps } from '../entity/user'

export class SaveUserController extends BaseController<UserProps, UserDto> {
    public async handle(request: UserProps): Promise<ResponseDto<UserDto>> {
        const command = new SaveUserCommand(request)
        const result = await this._send(command)

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), `Error during save user`)
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.CREATED) // 201 Created
    }
}