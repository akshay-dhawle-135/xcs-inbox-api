import { Entity, Index, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ConversationStatus, ConversationType } from '../../constants/enums';
import { ConversationContact } from './ConversationContact';

@Entity('conversations')
@Index('idx_conversations_account_id', ['account_id'])
@Index('idx_conversations_updated_at', ['updated_at'])
@Index('idx_conversations_account_updated_at', ['account_id', 'updated_at'])
export class Conversation extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.SMS,
  })
  conversation_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  conversation_name?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  account_id: string;

  @Column({ type: 'uuid', nullable: true })
  last_message_id?: string;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.OPEN,
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  read_at?: Date;

  @OneToMany(() => ConversationContact, (conversationContact) => conversationContact.conversation)
  conversationContacts: ConversationContact[];
}
