import { REQUEST_TYPE, type ICommand } from '@graviton5'

export class PingCommand implements ICommand<{ echoed: string }> {
    public readonly intent = 'PingCommand'
    public readonly type = REQUEST_TYPE.COMMAND

    constructor(public readonly message: string, public readonly signal: AbortSignal) { }
}