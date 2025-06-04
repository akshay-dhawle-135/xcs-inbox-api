import { Entity, PrimaryColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Conversation } from './Conversation';
import { Contact } from './Contact';

@Entity('conversations_contacts')
@Index('idx_conversations_contacts_conversation_id', ['conversation_id'])
@Index('idx_conversations_contacts_contact_id', ['contact_id'])
@Index('idx_conversations_contacts_updated_at', ['updated_at'])
@Index('idx_conversations_conversation_id_contact_id', ['conversation_id', 'contact_id'])
export class ConversationContact extends BaseEntity {
  @PrimaryColumn('uuid', { name: 'conversation_id' })
  conversation_id: string;

  @PrimaryColumn('uuid', { name: 'contact_id' })
  contact_id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.conversationContacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => Contact, (contact) => contact.conversationContacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;
}
