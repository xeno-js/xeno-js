import { REQUEST_TYPE, type ICommand } from '@gear5/core'

export class PingCommand implements ICommand<{ echoed: string }> {
    public readonly intent = 'PingCommand'
    public readonly type = REQUEST_TYPE.COMMAND

    constructor(public readonly message: string, public readonly signal: AbortSignal) { }
}