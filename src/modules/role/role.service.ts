import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleRepository } from './role.ropository';

@Injectable()
export class RoleService {
    constructor( 
        @InjectRepository(RoleRepository)
        private readonly _roleRopistory: RoleRepository
    ) {}

    async get(id: number): Promise<Role> {
        if(!id){
            throw new BadRequestException("id must be sent");
        }

        const role: Role = await this._roleRopistory.findOne(id, {where: {status: 'ACTIVE'}});

        if(!role){
            throw new NotFoundException();
        }

        return role;
    }
            
    async getAll(): Promise<Role[]> {
        const roles: Role[] = await this._roleRopistory.find({where: {status: 'ACTIVE'}});

        return roles;
    }

    async create(role: Role): Promise<Role> {
        const savedRole: Role = await this._roleRopistory.save(role);
        return savedRole;
    }

    async update(id: number, role: Role): Promise<void> {
        await this._roleRopistory.update(id, role);
    }

    async delete(id: number): Promise<void> {
        const roleExists = await this._roleRopistory.findOne(id, { where:  { status: 'ACTIVE' }});

        if(!roleExists){
            throw new NotFoundException();
        }

        await this._roleRopistory.update(id, { status: 'INACTIVE' });
    }

}
