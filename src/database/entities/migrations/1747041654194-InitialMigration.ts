import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1747041654194 implements MigrationInterface {
  name = 'InitialMigration1747041654194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."contacts_contact_source_enum" AS ENUM('internal', 'brandbot')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "account_id" character varying(100) NOT NULL, "first_name" character varying(100), "last_name" character varying(100), "email" character varying(320), "phone_number" character varying(20), "contact_source" "public"."contacts_contact_source_enum" NOT NULL, "external_contact_id" character varying(100), "unsubscribed_message_at" TIMESTAMP, CONSTRAINT "uq_contacts_account_source_external" UNIQUE ("account_id", "contact_source", "external_contact_id"), CONSTRAINT "uq_contacts_account_email" UNIQUE ("account_id", "email"), CONSTRAINT "uq_contacts_account_phone" UNIQUE ("account_id", "phone_number"), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_contacts_external_contact_id" ON "contacts" ("external_contact_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_contacts_account_id_email" ON "contacts" ("account_id", "email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_contacts_account_id_phone_number" ON "contacts" ("account_id", "phone_number") `,
    );
    await queryRunner.query(`CREATE INDEX "idx_contacts_updated_at" ON "contacts" ("updated_at") `);
    await queryRunner.query(`CREATE INDEX "idx_contacts_account_id" ON "contacts" ("account_id") `);
    await queryRunner.query(`CREATE INDEX "idx_contacts_id" ON "contacts" ("id") `);
    await queryRunner.query(
      `CREATE TYPE "public"."conversations_conversation_type_enum" AS ENUM('chat', 'sms', 'mms', 'email', 'whatsapp')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."conversations_status_enum" AS ENUM('open', 'closed', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "conversation_type" "public"."conversations_conversation_type_enum" NOT NULL DEFAULT 'sms', "conversation_name" character varying(255), "description" text, "account_id" character varying(100) NOT NULL, "last_message_id" uuid, "status" "public"."conversations_status_enum" NOT NULL DEFAULT 'open', "read_at" TIMESTAMP, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_conversations_account_updated_at" ON "conversations" ("account_id", "updated_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_conversations_updated_at" ON "conversations" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_conversations_account_id" ON "conversations" ("account_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations_contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "conversation_id" uuid NOT NULL, "contact_id" uuid NOT NULL, CONSTRAINT "PK_bfee9630ccbea3ba07076b15702" PRIMARY KEY ("id", "conversation_id", "contact_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_conversations_conversation_id_contact_id" ON "conversations_contacts" ("conversation_id", "contact_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_conversations_contacts_updated_at" ON "conversations_contacts" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_conversations_contacts_contact_id" ON "conversations_contacts" ("contact_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_conversations_contacts_conversation_id" ON "conversations_contacts" ("conversation_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."messages_direction_enum" AS ENUM('outbound', 'inbound')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."messages_message_source_enum" AS ENUM('system', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "conversation_id" uuid NOT NULL, "provider_message_id" character varying(100), "sender_contact_id" uuid, "message_body" text, "direction" "public"."messages_direction_enum" NOT NULL, "replied_to_message_id" uuid, "metadata" jsonb, "message_source" "public"."messages_message_source_enum" NOT NULL, "read_at" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_messages_conversation_id_created_at" ON "messages" ("conversation_id", "created_at") `,
    );
    await queryRunner.query(`CREATE INDEX "idx_messages_updated_at" ON "messages" ("updated_at") `);
    await queryRunner.query(
      `CREATE INDEX "idx_messages_sender_contact_id" ON "messages" ("sender_contact_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_messages_conversation_id" ON "messages" ("conversation_id") `,
    );
    await queryRunner.query(`CREATE INDEX "idx_messages_id" ON "messages" ("id") `);
    await queryRunner.query(
      `CREATE TYPE "public"."delivery_statuses_status_enum" AS ENUM('sent', 'delivered', 'received', 'message-created', 'failed', 'queued')`,
    );
    await queryRunner.query(
      `CREATE TABLE "delivery_statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "message_id" uuid NOT NULL, "status" "public"."delivery_statuses_status_enum" NOT NULL, "description" text, CONSTRAINT "PK_9879904dd0e500b28523986648a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_delivery_statuses_message_id_updated_at" ON "delivery_statuses" ("message_id", "updated_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_delivery_statuses_updated_at" ON "delivery_statuses" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_delivery_statuses_message_id" ON "delivery_statuses" ("message_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_delivery_statuses_id" ON "delivery_statuses" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations_contacts" ADD CONSTRAINT "FK_45e47c44dc90acf4e420e7a3eab" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations_contacts" ADD CONSTRAINT "FK_e5e395b351d796698dd5d64decc" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_31c8826f558cd48f047757fcf1e" FOREIGN KEY ("replied_to_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_dba2d76645941f416681fd409a4" FOREIGN KEY ("sender_contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery_statuses" ADD CONSTRAINT "FK_93777421f5aa1c998cb1bc705bf" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "delivery_statuses" DROP CONSTRAINT "FK_93777421f5aa1c998cb1bc705bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_dba2d76645941f416681fd409a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_31c8826f558cd48f047757fcf1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations_contacts" DROP CONSTRAINT "FK_e5e395b351d796698dd5d64decc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations_contacts" DROP CONSTRAINT "FK_45e47c44dc90acf4e420e7a3eab"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_delivery_statuses_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_delivery_statuses_message_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_delivery_statuses_updated_at"`);
    await queryRunner.query(`DROP INDEX "public"."idx_delivery_statuses_message_id_updated_at"`);
    await queryRunner.query(`DROP TABLE "delivery_statuses"`);
    await queryRunner.query(`DROP TYPE "public"."delivery_statuses_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_messages_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_messages_conversation_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_messages_sender_contact_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_messages_updated_at"`);
    await queryRunner.query(`DROP INDEX "public"."idx_messages_conversation_id_created_at"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TYPE "public"."messages_message_source_enum"`);
    await queryRunner.query(`DROP TYPE "public"."messages_direction_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_conversations_contacts_conversation_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_conversations_contacts_contact_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_conversations_contacts_updated_at"`);
    await queryRunner.query(`DROP INDEX "public"."idx_conversations_conversation_id_contact_id"`);
    await queryRunner.query(`DROP TABLE "conversations_contacts"`);
    await queryRunner.query(`DROP INDEX "public"."idx_conversations_account_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_conversations_updated_at"`);
    await queryRunner.query(`DROP INDEX "public"."idx_conversations_account_updated_at"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TYPE "public"."conversations_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."conversations_conversation_type_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_account_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_updated_at"`);
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_account_id_phone_number"`);
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_account_id_email"`);
    await queryRunner.query(`DROP INDEX "public"."idx_contacts_external_contact_id"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TYPE "public"."contacts_contact_source_enum"`);
  }
}
