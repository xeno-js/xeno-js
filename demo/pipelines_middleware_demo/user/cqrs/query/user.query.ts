import { type IQuery, type ICacheableOptions, REQUEST_TYPE } from '@xeno-js/core'

import type { User } from '../../entity/user'

export class UserQuery implements IQuery<User> {
    public readonly intent = 'FIND_USER_QUERY_HANDLER_TOKEN'
    public readonly type = REQUEST_TYPE.QUERY
    public readonly cacheOptions: ICacheableOptions
    
    constructor(public readonly id: string) {
        this.cacheOptions = {
            ttl: 60, // Cache for 60 seconds
            cacheKey: `${this.intent}:${id}`, // Unique cache key based on the payload
            bypassCache: false, // Do not bypass cache
            consistentRead: false, // Do not require consistent read
            isUserScoped: true // Cache is scoped to the user
        }
     }
}

export class FindAllUsersQuery implements IQuery<User[]> {
    public readonly intent = 'FIND_ALL_USERS_QUERY_HANDLER_TOKEN'
    public readonly type = REQUEST_TYPE.QUERY
    public readonly cacheOptions: ICacheableOptions

    constructor() {
        this.cacheOptions = {
            ttl: 60, // Cache for 60 seconds
            cacheKey: `${this.intent}`, // Unique cache key based on the payload
            bypassCache: true, // Do not bypass cache
            consistentRead: false, // Do not require consistent read
            isUserScoped: false // Cache is not scoped to the user
        }
    }
}