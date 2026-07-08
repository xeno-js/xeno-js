import { type IQuery, type ICacheableOptions, REQUEST_TYPE } from '@xeno/core'

import type { User } from '../../entity/user'

export class UserQuery implements IQuery<User> {
    public readonly intent = 'UserQuery'
    public readonly type = REQUEST_TYPE.QUERY
    public readonly cacheOptions: ICacheableOptions
    public readonly isPublic = true
    

    constructor(public readonly id: string) {
        this.cacheOptions = {
            ttl: 60, // Cache for 60 seconds
            cacheKey: `UserQuery:${id}`, // Unique cache key based on the payload
            bypassCache: false, // Do not bypass cache
            consistentRead: false // Do not require consistent read
        }
     }
}

export class FindAllUsersQuery implements IQuery<User[]> {
    public readonly intent = 'FindAllUsersQuery'
    public readonly type = REQUEST_TYPE.QUERY
    public readonly cacheOptions: ICacheableOptions
    public readonly isPublic = true

    constructor() {
        this.cacheOptions = {
            ttl: 60, // Cache for 60 seconds
            cacheKey: `FindAllUsersQuery`, // Unique cache key based on the payload
            bypassCache: true, // Do not bypass cache
            consistentRead: false // Do not require consistent read
        }
    }
}