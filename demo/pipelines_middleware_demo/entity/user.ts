import { Entity, UniqueId } from '@xeno/core'

export interface UserProps {
    name: string
    email: string
    password: string
    userId: string
    tenantId: string
}

export class User extends Entity<UserProps> {
    constructor(props: UserProps, id?: string) {
        super(props, id)
    }
}
