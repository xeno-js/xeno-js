import { BaseController, ResponseDto } from '@xeno/core'
import { PingCommand } from '../cqrs/command'
import { GetStatusQuery } from '../cqrs/query'

export class PingController extends BaseController<{ message: string; }, { echoed: string }> {
    public async handle(request: { message: string; }): Promise<ResponseDto<{ echoed: string }>> {
        const command = new PingCommand(request.message, new AbortController().signal)
        const result = await this._mediator.send<{ echoed: string }>(command)

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Failed to process ping')
        }

        return this.ok(result.getValueOrThrow()!, 201) // 201 Created
    }
}

export class StatusController extends BaseController<{ verbose: boolean; }, { status: string; uptime: number }> {
    public async handle(request: { verbose: boolean; }): Promise<ResponseDto<{ status: string; uptime: number }>> {
        const query = new GetStatusQuery(request.verbose, new AbortController().signal)
        const result = await this._mediator.send<{ status: string; uptime: number }>(query)

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Failed to retrieve status')
        }

        return this.ok(result.getValueOrThrow()!, 200) // 200 OK
    }
}