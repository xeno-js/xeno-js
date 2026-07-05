import type { DbContext, IReadDataSource } from '@xeno/core'
import type { UserDto } from '../schema'
import { eq } from 'drizzle-orm';
import { users } from '../schema';

export class UserReadDatasource implements IReadDataSource<UserDto> {
    constructor(
        private readonly _dbContext: DbContext<UserDto>
    ) { }

    public async findById(id: string | number, _ctx: any, _signal: AbortSignal): Promise<UserDto | undefined> {
        // Implement your logic to find a user by ID here
        // For demonstration, returning a dummy user
        const user = await this._dbContext.select().from(users).where(eq(users.id, id)).limit(1).execute();
        return user.length > 0 ? user[0] : undefined;
    }

    public async find(name: string, ctx: any, signal: AbortSignal): Promise<UserDto[]> {
        // Implement your logic to find users here
        // For demonstration, returning all users
        const usersList = await this._dbContext.select().from(users).where(eq(users.name, name)).execute();
        return usersList;
    }
}
