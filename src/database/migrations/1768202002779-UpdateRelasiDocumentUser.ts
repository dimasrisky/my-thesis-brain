import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelasiDocumentUser1768202002779 implements MigrationInterface {
    name = 'UpdateRelasiDocumentUser1768202002779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd"`);
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "userId"`);
    }

}
