import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Contact1748868729794 implements MigrationInterface {
  name = 'Contact1748868729794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contacts" ADD CONSTRAINT "UQ_736eb30c4220859bd55d8e79532" UNIQUE ("phone_number")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contacts" DROP CONSTRAINT "UQ_736eb30c4220859bd55d8e79532"`,
    );
  }
}
