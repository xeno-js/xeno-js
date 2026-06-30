import { REQUEST_TYPE, type IQuery } from '@gantry5/core'

export class GetStatusQuery implements IQuery<{ status: string; uptime: number }> {
    public readonly intent = 'GetStatusQuery'
    public readonly type = REQUEST_TYPE.QUERY
    public readonly readCriteria = { where: [], orderBy: undefined, limit: undefined, offset: undefined, cols: [] }

    constructor(public readonly verbose: boolean, public readonly signal: AbortSignal) { }
}