import type { IWriteDataSource, DbContext, Optional, UserContext } from '@xeno/core'
import { and, AppError, Enumerable, eq } from '@xeno/core';
import { UserDto, users } from '../../schema';

export class UserDataSource implements IWriteDataSource<UserDto> {
    constructor(private _db: DbContext<UserDto>) {}

    public async findById(id: string | number, ctx: UserContext, signal: Optional<AbortSignal>): Promise<Optional<UserDto>> {
        AppError.throwIfAborted(signal, 'UserDataSource.findById');
        const result = await this._db.select().from(users).where(and(eq(users.id, id))).limit(1).execute();
        return Enumerable.firstOrDefault(result);
    }

    public async find(props: { name: string, email: string }, ctx: UserContext, signal: Optional<AbortSignal>): Promise<UserDto[]> {
        AppError.throwIfAborted(signal, 'UserDataSource.find');
        return this._db.select().from(users).where(and(eq(users.name, props.name), eq(users.email, props.email))).execute(); // in a real-world scenario, you might want to add more sophisticated filtering and pagination logic here, such as multi teant support, sorting, and filtering based on various user properties.
        // eq(users.tenantId, ctx.tenantId), eq(users.userId, ctx.userId)
    }

    public async insert(dto: UserDto, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'UserDataSource.insert');
        await this._db.insert(users).values(dto).execute();
    }

    public async delete(dto: UserDto, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'UserDataSource.delete');
        await this._db.delete(users).where(and(eq(users.id, dto.id), eq(users.tenantId, ctx.tenantId), eq(users.userId, ctx.userId))).execute();
    }

    public async update(id: string | number, dto: Partial<UserDto>, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        AppError.throwIfAborted(signal, 'UserDataSource.update');
        await this._db.update(users).set(dto).where(and(eq(users.id, id))).execute();
    }
}
