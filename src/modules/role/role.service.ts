import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { Role } from './role.entity';
import { RoleRepository } from './role.ropository';

@Injectable()
export class RoleService {
    constructor( 
        @InjectRepository(RoleRepository)
        private readonly _roleRopistory: RoleRepository
    ) {}

    async get(id: number): Promise<ReadRoleDto> {
        if(!id){
            throw new BadRequestException("id must be sent");
        }

        const role: Role = await this._roleRopistory.findOne(id, {where: {status: 'ACTIVE'}});

        if(!role){
            throw new NotFoundException();
        }

        return plainToClass(ReadRoleDto, role);
    }
            
    async getAll(): Promise<ReadRoleDto[]> {
        const roles: Role[] = await this._roleRopistory.find({where: {status: 'ACTIVE'}});

        return roles.map((role) => plainToClass(ReadRoleDto, role) );
    }

    async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
        const savedRole: Role = await this._roleRopistory.save(role);
        return plainToClass(ReadRoleDto, savedRole);
    }

    async update(roleId: number, role: Partial<UpdateRoleDto>): Promise<ReadRoleDto> {
        const foundRole: Role = await this._roleRopistory.findOne(roleId);

        if (!foundRole) {
            throw new NotFoundException('This role does not exist');
        }

        foundRole.name = role.name;
        foundRole.description = role.description;

        const updatedRole: Role = await this._roleRopistory.save(foundRole);

        return plainToClass(ReadRoleDto, updatedRole);
    }

    async delete(id: number): Promise<void> {
        const roleExists = await this._roleRopistory.findOne(id, { where:  { status: 'ACTIVE' }});

        if(!roleExists){
            throw new NotFoundException();
        }

        await this._roleRopistory.update(id, { status: 'INACTIVE' });
    }

}
