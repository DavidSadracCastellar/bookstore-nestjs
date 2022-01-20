import { BadRequestException, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Connection, getConnection, createConnection } from 'typeorm';
import { TenancyController } from './tenancy.controller';
import { TenancyService } from './tenancy.service';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenancy } from './tenancy.entity';
import { User } from '../user/user.entity';
import { Book } from '../book/book.entity';
import { Role } from '../role/role.entity';
import { UserDetails } from '../user/user.details.entity';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tenancy]), ConfigModule],
  controllers: [TenancyController],
  providers: [TenancyService]
})
export class TenancyModule {
  static tenant: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly tenancyService: TenancyService
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        const name: string = req.params['tenant'];
        const tenant: Tenancy = await this.tenancyService.findOne(name);

        if (!tenant) {
          throw new BadRequestException(
            "Database Connection Error",
            "This tenant does not exists!"
          );
        }

        try {
          //getConnection(tenant.name);
          TenancyModule.tenant = tenant.name;
          next();
        } catch (e) {

          /*
          await this.connection.query(
            `CREATE DATABASE IF NOT EXISTS ${tenant.name}`,
          );

          const createdConnection: Connection = await createConnection({
            name: tenant.name,
            type: 'postgres',
            host: this.configService.get(Configuration.HOST),
            port: +this.configService.get(Configuration.PORT_PG),
            database: tenant.name,
            username: this.configService.get(Configuration.USERNAME),
            password: this.configService.get(Configuration.PASSWORD),
            entities: [User, UserDetails, Role, Book],
            synchronize: true
          });

          if (createdConnection) {
            next();
          } else {
            throw new BadRequestException(
              "Database connection Error",
              "There is a Error with the Database!"
            );
          }
          */

        }
      })
      .exclude({ path: '/api/tenants', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
