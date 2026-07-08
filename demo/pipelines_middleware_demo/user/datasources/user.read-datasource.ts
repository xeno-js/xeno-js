import type { DbContext, IReadDataSource, Optional, UserContext } from '@xeno/core'
import type { UserDto } from '../../schema'
import { AppError, Enumerable, eq } from '@xeno/core';
import { users } from '../../schema';

export interface IUserDataSource extends IReadDataSource<UserDto> {
    findByUserId(userId: string, signal: Optional<AbortSignal>): Promise<Optional<UserDto>>;
}

export class UserReadDatasource implements IUserDataSource {
    constructor(
        private readonly _dbContext: DbContext<UserDto>
    ) { }

    public async findById(id: string | number, _ctx: UserContext, signal: Optional<AbortSignal>): Promise<UserDto | undefined> {
        // Implement your logic to find a user by ID here
        // For demonstration, returning a dummy user

        AppError.throwIfAborted(signal, 'UserReadDatasource.findById');
        const user = await this._dbContext.select().from(users).where(eq(users.id, id)).limit(1).execute();
        return Enumerable.firstOrDefault(user);
    }

    public async findAll(_ctx: UserContext, signal: Optional<AbortSignal>): Promise<UserDto[]> {
        // Implement your logic to find users here
        // For demonstration, returning all users
        AppError.throwIfAborted(signal, 'UserReadDatasource.findAll');
        const usersList = await this._dbContext.select().from(users);
        return usersList;
    }

    
    public async findByUserId(userId: string, signal: Optional<AbortSignal>): Promise<Optional<UserDto>> {
        AppError.throwIfAborted(signal, 'UserReadDatasource.findByUserId');
        const result = await this._dbContext.select().from(users).where(eq(users.userId, userId)).limit(1).execute();
        return Enumerable.firstOrDefault(result);
    }
}