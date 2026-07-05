import { REQUEST_TYPE, type ICommand } from '@xeno/core'
import { UserProps } from '../entity/user'

export class UserCommand implements ICommand<UserProps> {
    public readonly intent = 'UserCommand'
    public readonly type = REQUEST_TYPE.COMMAND

    constructor(
        public readonly payload: UserProps
    ) { }
}