import { type ICachedQuery, type ICacheableOptions, REQUEST_TYPE } from '@xeno/core'

export class GetStatusQuery implements ICachedQuery<{ status: string; uptime: number }> {
    public readonly intent = 'GetStatusQuery'
    public readonly type = REQUEST_TYPE.QUERY
    public readonly readCriteria = { where: [], orderBy: undefined, limit: undefined, offset: undefined, cols: [] }
    public readonly cacheOptions: ICacheableOptions

    constructor(public readonly verbose: boolean) {
        this.cacheOptions = {
            cacheTtlSeconds: 60, // Cache for 60 seconds
            cacheKey: `GetStatusQuery:${verbose}`, // Unique cache key based on the verbose flag
            bypassCache: false, // Do not bypass cache
            consistentRead: false // Do not require consistent read
        }
     }
}