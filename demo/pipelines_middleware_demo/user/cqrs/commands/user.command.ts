import { REQUEST_TYPE, type ICommand } from '@xeno/core'
import { UserProps } from '../../entity/user'

export class SaveUserCommand implements ICommand<UserProps, void> {
    public readonly intent = 'SaveUserCommand'
    public readonly type = REQUEST_TYPE.COMMAND

    constructor(
        public readonly payload: UserProps
    ) { }
}

export class UpdateUserCommand implements ICommand<UserProps & { id: string }, void> {
    public readonly intent = 'UpdateUserCommand'
    public readonly type = REQUEST_TYPE.COMMAND

    constructor(
        public readonly payload: UserProps & { id: string }
    ) { }
}