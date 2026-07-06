import type { IMapper, IReadDao, Optional, UserContext } from "@xeno/core";
import { ReadDao } from "@xeno/core";

import { User } from "../entity/user";
import { UserDto } from "../../schema";
import { IUserDataSource } from "../datasources/user.read-datasource";

export interface IUserReadRepository extends IReadDao<User> {
    findByUserId(userId: string, signal: Optional<AbortSignal>): Promise<User | null>;
}

export class UserReadRepository extends ReadDao<User, UserDto> implements IUserReadRepository {
    constructor(
        readonly datasource: IUserDataSource,
        readonly mapper: IMapper<User, UserDto>
    ) {
        super(datasource, mapper);
    }

    public async findByUserId(userId: string, signal: Optional<AbortSignal>): Promise<User | null> {
        const userDto = await this.datasource.findByUserId(userId, signal);

        if (!userDto) {
            return null;
        }
        return this.mapper.toEntity(userDto);
    }
}