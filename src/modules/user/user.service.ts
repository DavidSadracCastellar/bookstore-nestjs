import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '../role/role.ropository';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { status } from '../../shared/entity-status.num';
import { ReadUserDto, UpdateUserDto } from './dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
    constructor( 
        @InjectRepository(UserRepository)
        private readonly _userRopistory: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRopistory: RoleRepository,
    ) {}

    async get(userId: number): Promise<ReadUserDto> {
        if(!userId){
            throw new BadRequestException("id must be sent");
        }

        const user: User = await this._userRopistory.findOne(userId, {where: {status: status.ACTIVE}});

        if(!user){
            throw new NotFoundException();
        }

        return plainToClass(ReadUserDto, user);
    }
            
    async getAll(): Promise<ReadUserDto[]> {
        const users: User[] = await this._userRopistory.find({where: {status: status.ACTIVE}});

        return users.map((user: User) => plainToClass(ReadUserDto, user));
    }

    async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
        const foundUser: User = await this._userRopistory.findOne(userId);

        if(!foundUser) {
            throw new NotFoundException('This user does not exist');
        }

        foundUser.username = user.username;
        const updatedUser: User = await this._userRopistory.save(foundUser);

        return plainToClass(ReadUserDto, updatedUser);
    }

    async delete(userId: number): Promise<void> {
        const userExists = await this._userRopistory.findOne(userId, { where:  { status: status.ACTIVE }});

        if(!userExists){
            throw new NotFoundException();
        }

        await this._userRopistory.update(userId, { status: status.INACTIVE });
    }

    async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
        const userExists = await this._userRopistory.findOne(userId, { where:  { status: status.ACTIVE }});

        if(!userExists){
            throw new NotFoundException();
        }

        const roleExists = await this._roleRopistory.findOne(roleId, { where:  { status: status.ACTIVE }});

        if(!roleExists){
            throw new NotFoundException("Role does not exist");
        }

        userExists.roles.push(roleExists);
        await this._userRopistory.save(userExists);

        return true;
    }
}
