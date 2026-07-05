import type { IWriteDataSource, DbContext, Optional, UserContext } from '@xeno/core'
import { and, eq } from 'drizzle-orm';
import { UserDto, users } from '../schema';

export class UserDataSource implements IWriteDataSource<UserDto> {
    constructor(private _db: DbContext<UserDto>) {}

    public async findById(id: string | number, ctx: UserContext, signal: Optional<AbortSignal>): Promise<Optional<UserDto>> {
        if(!ctx.tenantId)
            throw new Error('Tenant ID is required in the user context.');

        const result = await this._db.select().from(users).where(and(eq(users.id, id))).limit(1).execute();
        return result.length > 0 ? result[0] : undefined;
    }

    public async find(name: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<UserDto[]> {
        if(!ctx.tenantId)
            throw new Error('Tenant ID is required in the user context.');

        return await this._db.select().from(users).where(and(eq(users.name, name), eq(users.tenantId, ctx.tenantId), eq(users.userId, ctx.userId))).execute();
    }

    public async insert(dto: UserDto, signal: Optional<AbortSignal>): Promise<void> {
        await this._db.insert(users).values(dto).execute();
    }

    public async delete(dto: UserDto, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        if(!ctx.tenantId)
            throw new Error('Tenant ID is required in the user context.');

        await this._db.delete(users).where(and(eq(users.id, dto.id), eq(users.tenantId, ctx.tenantId), eq(users.userId, ctx.userId))).execute();
    }

    public async update(id: string | number, dto: Partial<UserDto>, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void> {
        if(!ctx.tenantId)
            throw new Error('Tenant ID is required in the user context.');

        await this._db.update(users).set(dto).where(and(eq(users.id, id))).execute();
    }
}
