import { TenancyModule } from "../../modules/tenancy/tenancy.module";
import {MigrationInterface, QueryRunner} from "typeorm";

export class userRoles1636042226018 implements MigrationInterface {
    name = 'userRoles1636042226018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const schema = (TenancyModule.tenant ? TenancyModule.tenant : 'public');
        await queryRunner.query(`CREATE TABLE "${schema}.users_details" ("id" SERIAL NOT NULL, "firstname" character varying(50) NOT NULL, "lastname" character varying, "status" character varying(8) NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_05b6d195a298be51e8fd56e8bc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}.roles" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "status" character varying(8) NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}.user_roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_38ffcfb865fc628fa337d9a0d4f" PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_99b019339f52c63ae615358738" ON "${schema}.user_roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_13380e7efec83468d73fc37938" ON "${schema}.user_roles" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "${schema}.users" ADD "datail_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}.users" ADD CONSTRAINT "UQ_e9a87388523f59c099c5085b8fb" UNIQUE ("datail_id")`);
        await queryRunner.query(`ALTER TABLE "${schema}.users" ADD CONSTRAINT "FK_e9a87388523f59c099c5085b8fb" FOREIGN KEY ("datail_id") REFERENCES "${TenancyModule.tenant}.users_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}.user_roles" ADD CONSTRAINT "FK_99b019339f52c63ae6153587380" FOREIGN KEY ("usersId") REFERENCES "${TenancyModule.tenant}.users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "${schema}.user_roles" ADD CONSTRAINT "FK_13380e7efec83468d73fc37938e" FOREIGN KEY ("rolesId") REFERENCES "${TenancyModule.tenant}.roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const schema = (TenancyModule.tenant ? TenancyModule.tenant : 'public');
        await queryRunner.query(`ALTER TABLE "${schema}.user_roles" DROP CONSTRAINT "FK_13380e7efec83468d73fc37938e"`);
        await queryRunner.query(`ALTER TABLE "${schema}.user_roles" DROP CONSTRAINT "FK_99b019339f52c63ae6153587380"`);
        await queryRunner.query(`ALTER TABLE "${schema}.users" DROP CONSTRAINT "FK_e9a87388523f59c099c5085b8fb"`);
        await queryRunner.query(`ALTER TABLE "${schema}.users" DROP CONSTRAINT "UQ_e9a87388523f59c099c5085b8fb"`);
        await queryRunner.query(`ALTER TABLE "${schema}.users" DROP COLUMN "datail_id"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_13380e7efec83468d73fc37938"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_99b019339f52c63ae615358738"`);
        await queryRunner.query(`DROP TABLE "${schema}.user_roles"`);
        await queryRunner.query(`DROP TABLE "${schema}.roles"`);
        await queryRunner.query(`DROP TABLE "${schema}.users_details"`);
    }

}
