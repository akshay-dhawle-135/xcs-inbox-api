import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Message1747740425070 implements MigrationInterface {
  name = 'Message1747740425070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_dba2d76645941f416681fd409a4"`,
    );
    await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "sender_contact_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "message_body" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_dba2d76645941f416681fd409a4" FOREIGN KEY ("sender_contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_dba2d76645941f416681fd409a4"`,
    );
    await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "message_body" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "messages" ALTER COLUMN "sender_contact_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_dba2d76645941f416681fd409a4" FOREIGN KEY ("sender_contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
