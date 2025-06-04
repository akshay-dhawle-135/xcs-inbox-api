import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Contact1748867326940 implements MigrationInterface {
  name = 'Contact1748867326940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contacts" DROP CONSTRAINT "uq_contacts_account_source_external"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts" ALTER COLUMN "contact_source" SET DEFAULT 'internal'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts" ADD CONSTRAINT "uq_contacts_account_source_external" UNIQUE ("external_account_id", "contact_source", "external_contact_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contacts" DROP CONSTRAINT "uq_contacts_account_source_external"`,
    );
    await queryRunner.query(`ALTER TABLE "contacts" ALTER COLUMN "contact_source" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "contacts" ADD CONSTRAINT "uq_contacts_account_source_external" UNIQUE ("external_account_id", "contact_source", "external_contact_id")`,
    );
  }
}
