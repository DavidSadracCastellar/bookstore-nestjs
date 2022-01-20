import {MigrationInterface, QueryRunner} from "typeorm";

export class entityTenancy1641315638425 implements MigrationInterface {
    name = 'entityTenancy1641315638425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenancy" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_53823ab6f0fc6def2626c983f0b" UNIQUE ("name"), CONSTRAINT "PK_c98009ac41a45bd29d8a56431ce" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenancy"`);
    }

}
