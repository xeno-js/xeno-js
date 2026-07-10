import { BaseController, ICommand, ResponseDto, STATUS_CODES } from '@xeno/core'

export class UnauthorizedController extends BaseController<null, null> {
    public async handle(_request: null): Promise<ResponseDto<null>> {
        const cmd: ICommand<null> = {
            intent: 'UNAUTHORIZED_COMMAND_HANDLER_TOKEN',
            type: 'COMMAND'
        }

        const result = await this._send(cmd)
        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Unauthorized access')
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.UNAUTHORIZED) // 401 Unauthorized
    }
}