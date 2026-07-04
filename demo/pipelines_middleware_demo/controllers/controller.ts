import { AppError, BaseController, ICommand, ResponseDto, STATUS_CODES } from '@xeno/core'
import { PingCommand } from '../cqrs/command'
import { GetStatusQuery } from '../cqrs/query'

export class PingController extends BaseController<{ message: string; }, { echoed: string }> {
    public async handle(request: { message: string; }): Promise<ResponseDto<{ echoed: string }>> {
        const command = new PingCommand(request.message)
        const result = await this._send(command)

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Failed to process ping')
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.CREATED) // 201 Created
    }
}

export class StatusController extends BaseController<{ verbose: boolean; }, { status: string; uptime: number }> {
    public async handle(request: { verbose: boolean; }): Promise<ResponseDto<{ status: string; uptime: number }>> {
        const query = new GetStatusQuery(request.verbose)
        const result = await this._query(query)

        if (!result.isOk()) {
            console.error(`[StatusController] ❌ Error processing GetStatusQuery: ${result.getErrorOrThrow()}`)
            return this.fail(result.getErrorOrThrow(), 'Failed to retrieve status')
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.OK) // 200 OK
    }
}

export class ErrorController extends BaseController<null, null> {
    public async handle(_request: null): Promise<ResponseDto<null>> {
        return this.fail(AppError.create({
            name: 'SimulatedError',
            code: 'SIMULATED_ERROR',
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: 'This is a simulated error for demonstration purposes.',
            cause: null,
            header: { ['X-Demo-Error']: ['SimulatedError'] }
        }), 'Simulated error for demonstration purposes')
    }
}

export class UnauthorizedController extends BaseController<null, null> {
    public async handle(_request: null): Promise<ResponseDto<null>> {
        const cmd: ICommand<null> = {
            intent: 'UnauthorizedAccessCommand',
            type: 'COMMAND',
        }

        const result = await this._send(cmd)
        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Unauthorized access')
        }

        return this.ok(result.getValueOrThrow()!, STATUS_CODES.FORBIDDEN) // 403 Forbidden
    }
}