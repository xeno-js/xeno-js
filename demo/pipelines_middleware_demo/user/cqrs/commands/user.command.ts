import { REQUEST_TYPE, type ICommand } from '@xeno/core'
import { UserProps } from '../../entity/user'

export class SaveUserCommand implements ICommand<void> {
    public readonly intent = 'SaveUserCommand'
    public readonly type = REQUEST_TYPE.COMMAND

    constructor(
        public readonly props: UserProps
    ) { }
}

export class UpdateUserCommand implements ICommand<void> {
    public readonly intent = 'UpdateUserCommand'
    public readonly type = REQUEST_TYPE.COMMAND
    public readonly isPublic = true

    constructor(
        public readonly props: UserProps & { id: string }
    ) { }
}