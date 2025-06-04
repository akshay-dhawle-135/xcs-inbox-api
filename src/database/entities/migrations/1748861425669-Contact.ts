import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Contact1748861425669 implements MigrationInterface {
  name = 'Contact1748861425669';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_account_id_email"`);
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_account_id_phone_number"`);
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_account_id"`);
    await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "uq_contacts_account_email"`);
    await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "uq_contacts_account_phone"`);
    await queryRunner.query(
      `ALTER TABLE "contacts" RENAME COLUMN "account_id" TO "external_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts" ALTER COLUMN "external_account_id" DROP NOT NULL`,
    );
    await queryRunner.query(`CREATE INDEX "idx_contacts_email" ON "contacts" ("email") `);
    await queryRunner.query(
      `CREATE INDEX "idx_contacts_phone_number" ON "contacts" ("phone_number") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_phone_number"`);
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_email"`);
    await queryRunner.query(
      `ALTER TABLE "contacts" ALTER COLUMN "external_account_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts" RENAME COLUMN "external_account_id" TO "account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts" ADD CONSTRAINT "uq_contacts_account_phone" UNIQUE ("account_id", "phone_number")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts" ADD CONSTRAINT "uq_contacts_account_email" UNIQUE ("account_id", "email")`,
    );
    await queryRunner.query(`CREATE INDEX "idx_contacts_account_id" ON "contacts" ("account_id") `);
    await queryRunner.query(
      `CREATE INDEX "idx_contacts_account_id_phone_number" ON "contacts" ("account_id", "phone_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_contacts_account_id_email" ON "contacts" ("account_id", "email") `,
    );
  }
}
