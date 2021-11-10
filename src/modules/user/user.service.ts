import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.ropository';
import { UserDto } from './dto/user.dto';
import { UserDetails } from './user.details.entity';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { status } from '../../shared/entity-status.num';

@Injectable()
export class UserService {
    constructor( 
        @InjectRepository(UserRepository)
        private readonly _userRopistory: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRopistory: RoleRepository,
    ) {}

    async get(id: number): Promise<User> {
        if(!id){
            throw new BadRequestException("id must be sent");
        }

        const user: User = await this._userRopistory.findOne(id, {where: {status: status.ACTIVE}});

        if(!user){
            throw new NotFoundException();
        }

        return user;
    }
            
    async getAll(): Promise<User[]> {
        const users: User[] = await this._userRopistory.find({where: {status: status.ACTIVE}});

        return users;
    }

    async create(user: User): Promise<User> {
        const details = new UserDetails();
        user.details = details;

        const repo = await getConnection().getRepository(Role);
        const defaultRole = await repo.findOne({ where: { name: 'GENERAL' }});
        user.roles = [defaultRole];

        const savedUser: User = await this._userRopistory.save(user);
        return user;
    }

    async update(id: number, user: User): Promise<void> {
        await this._userRopistory.update(id, user);
    }

    async delete(id: number): Promise<void> {
        const userExists = await this._userRopistory.findOne(id, { where:  { status: status.ACTIVE }});

        if(!userExists){
            throw new NotFoundException();
        }

        await this._userRopistory.update(id, { status: status.INACTIVE });
    }

    async setRoleToUser(userId: number, roleId: number) {
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
