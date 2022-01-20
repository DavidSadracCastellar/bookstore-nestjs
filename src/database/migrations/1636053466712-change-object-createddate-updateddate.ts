import { TenancyModule } from "../../modules/tenancy/tenancy.module";
import {MigrationInterface, QueryRunner} from "typeorm";

export class changeObjectCreateddateUpdateddate1636053466712 implements MigrationInterface {
    name = 'changeObjectCreateddateUpdateddate1636053466712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const schema = (TenancyModule.tenant ? TenancyModule.tenant : 'public');
        await queryRunner.query(`ALTER TABLE "${schema}.users" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "${schema}.users" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "${schema}.roles" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "${schema}.roles" ALTER COLUMN "updated_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const schema = (TenancyModule.tenant ? TenancyModule.tenant : 'public');
        await queryRunner.query(`ALTER TABLE "${schema}.roles" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "${schema}.roles" ALTER COLUMN "created_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "${schema}.users" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "${schema}.users" ALTER COLUMN "created_at" DROP DEFAULT`);
    }

}
