import type { IWriteDataSource, DbContext, Optional, UserContext, IRepository, IMapper } from '@xeno/core'
import { Repository } from '@xeno/core';
import { UserDto } from '../../schema';
import { User } from '../entity/user';

export interface IUserWriteRepository extends IRepository<User> {
    findByUserId(userId: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<User | null>;
}

export class UserWriteRepository extends Repository<User, UserDto> implements IUserWriteRepository {
    constructor(
        readonly datasource: IWriteDataSource<UserDto>,
        readonly mapper: IMapper<User, UserDto>
    ) {
        super(datasource, mapper);
    }

    public async findByUserId(userId: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<User | null> {
        // Implement your logic to find a user by userId here
        // For demonstration, returning a dummy user
        const userDto = await this.datasource.find({ name: '', email: '' }, ctx, signal);
        if (!userDto || userDto.length === 0) {
            return null;
        }
        return this.mapper.toEntity(userDto[0]);
    }
}