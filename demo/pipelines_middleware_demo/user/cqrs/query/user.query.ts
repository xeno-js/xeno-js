import { type IQuery, type ICacheableOptions, REQUEST_TYPE } from '@xeno/core'

import type { User } from '../../entity/user'

export class UserQuery implements IQuery<{ id: string }, User> {
    public readonly intent = 'UserQuery'
    public readonly type = REQUEST_TYPE.QUERY
    public readonly cacheOptions: ICacheableOptions
    

    constructor(public readonly payload: { id: string }) {
        this.cacheOptions = {
            ttl: 60, // Cache for 60 seconds
            cacheKey: `UserQuery:${payload.id}`, // Unique cache key based on the payload
            bypassCache: false, // Do not bypass cache
            consistentRead: false // Do not require consistent read
        }
     }
}