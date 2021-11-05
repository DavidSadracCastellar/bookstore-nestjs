import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDateUserDatails1636088176579 implements MigrationInterface {
    name = 'fixDateUserDatails1636088176579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "updated_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "created_at" DROP DEFAULT`);
    }

}
