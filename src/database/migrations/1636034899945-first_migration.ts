import { TenancyModule } from "../../modules/tenancy/tenancy.module";
import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1636034899945 implements MigrationInterface {
    name = 'firstMigration1636034899945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const schema = (TenancyModule.tenant ? TenancyModule.tenant : 'public');
        await queryRunner.query(`CREATE TABLE "${schema}.users" ("id" SERIAL NOT NULL, "username" character varying(25) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "status" character varying(8) NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const schema = (TenancyModule.tenant ? TenancyModule.tenant : 'public');
        await queryRunner.query(`DROP TABLE "${schema}.users"`);
    }

}
