import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository, Connection } from 'typeorm';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';

import { Tenancy } from './tenancy.entity';
import { CreateTenancyDto, ReadTenancyDto } from './dtos';

@Injectable()
export class TenancyService {
    constructor( 
        @InjectRepository(Tenancy)
        private readonly _tenancyRopistory: Repository<Tenancy>,
        private readonly _connection: Connection,
        private readonly _configService: ConfigService
    ) {}

    async findAll(): Promise<ReadTenancyDto[]> {
        const tenancies: Tenancy[] = await this._tenancyRopistory.find();

        return tenancies.map((tenancy) => plainToClass(ReadTenancyDto, tenancy) );
    }

    async findOne(name: string): Promise<Tenancy> {
        if(!name){
            throw new BadRequestException("id must be sent");
        }

        const tenancy: Tenancy = await this._tenancyRopistory.findOne({name});

        if(!tenancy){
            throw new NotFoundException();
        }

        return tenancy;
    }

    async create(tenancy: Partial<CreateTenancyDto>): Promise<ReadTenancyDto> {
        const savedTenancy: Tenancy = await this._tenancyRopistory.save(tenancy);


        // `CREATE SCHEMA IF NOT EXISTS ${tenancy.name} AUTHORIZATION ${this._configService.get(Configuration.USERNAME)}`

        await this._connection.query(`CREATE DATABASE IF NOT EXISTS ${tenancy.name}`);

        return plainToClass(ReadTenancyDto, savedTenancy);
    }

}
