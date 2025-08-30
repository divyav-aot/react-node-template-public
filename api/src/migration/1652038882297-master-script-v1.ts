import { MigrationInterface, QueryRunner } from 'typeorm'

export class masterScriptV11652038882297 implements MigrationInterface {
  name = 'masterScriptV11652038882297'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "middle_name" character varying(50) DEFAULT null, "last_name" character varying(50) NOT NULL, "date_of_birth" date NOT NULL, "created_datetime" TIMESTAMP NOT NULL DEFAULT now(), "updated_datetime" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "user"')
  }
}
