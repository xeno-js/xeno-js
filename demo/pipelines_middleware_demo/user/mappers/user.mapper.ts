import type { IMapper } from '@xeno/core';
import { UserDto } from '../../schema';
import { User, UserProps } from '../entity/user';

export class UserMapper implements IMapper<User, UserDto> {
    public toEntity(dto: UserDto): User {
        const props: UserProps = {
            name: dto.name,
            email: dto.email,
            password: dto.password,
            tenantId: dto.tenantId,
            userId: dto.userId
        };
        return new User(props);
    }

    public toDto(entity: User): UserDto {
        const props = entity.getProps();
        return {
            name: props.name,
            email: props.email,
            password: props.password,
            tenantId: props.tenantId,
            userId: props.userId,
            createdAt: new Date()
        };
    }

    public toPartialDto(entity: Partial<User>): Partial<UserDto> {
        const props = entity.getProps ? entity.getProps() : {} as UserProps;

        return {
            name: props.name,
            email: props.email,
            password: props.password,
            userId: props.userId,
            tenantId: props.tenantId
        };
    }
}