import { AppError, BaseController, ICommand, ResponseDto, STATUS_CODES, StringHelper } from '@xeno/core'
import type { UserDto } from '../schema'
import { UserCommand } from '../cqrs/command'
import { UserQuery } from '../cqrs/query'
import { User, UserProps } from '../entity/user'

export class SaveUserController extends BaseController<UserProps, UserDto> {
    public async handle(request: UserProps): Promise<ResponseDto<UserDto>> {
        const command = new UserCommand(request)
        const result = await this._send(command)

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), `Failed to process user "${StringHelper.safeStringify(request)}"`)
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.CREATED) // 201 Created
    }
}

export class FindUserController extends BaseController<{id: string}, User> {
    public async handle(request: { id: string}): Promise<ResponseDto<User>> {
        const query = new UserQuery({ id: request.id })
        const result = await this._query(query)

        if (!result.isOk()) {
            console.error(`[UserController] ❌ Error processing UserQuery: ${result.getErrorOrThrow()}`)
            return this.fail(result.getErrorOrThrow(), `User with id: "${request.id}" not found`)
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.OK) // 200 OK
    }
}

export class UserTransactionController extends BaseController<null, void> {
    public async handle(_request: null): Promise<ResponseDto<void>> {
        const command: ICommand<null> = {
            intent: 'UserTransactionCommand',
            type: 'COMMAND',
            payload: null
        }

        const result = await this._send(command)
        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Transaction failed')
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.OK) // 200 OK
    }
}

export class UnauthorizedController extends BaseController<null, null> {
    public async handle(_request: null): Promise<ResponseDto<null>> {
        const cmd: ICommand<null> = {
            intent: 'UnauthorizedAccessCommand',
            type: 'COMMAND',
            payload: null
        }

        const result = await this._send(cmd)
        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Unauthorized access')
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.UNAUTHORIZED) // 401 Unauthorized
    }
}