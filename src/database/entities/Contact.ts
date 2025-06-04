import { Entity, Column, Index, Unique, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ContactSource } from '../../constants/enums';
import { ConversationContact } from './ConversationContact';

@Entity('contacts')
@Index('idx_contacts_id', ['id'])
@Index('idx_contacts_updated_at', ['updated_at'])
@Index('idx_contacts_phone_number', ['phone_number'])
@Index('idx_contacts_email', ['email'])
@Index('idx_contacts_external_contact_id', ['external_contact_id'])
@Unique('uq_contacts_phone', ['phone_number'])
@Unique('uq_contacts_account_source_external', [
  'external_account_id',
  'contact_source',
  'external_contact_id',
])
export class Contact extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name?: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number?: string;

  @Column({
    type: 'enum',
    enum: ContactSource,
    default: ContactSource.INTERNAL,
  })
  contact_source: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  external_contact_id?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  external_account_id?: string;

  @Column({ type: 'timestamp', nullable: true })
  unsubscribed_message_at?: Date;

  @OneToMany(() => ConversationContact, (conversationContact) => conversationContact.contact)
  conversationContacts: ConversationContact[];
}
