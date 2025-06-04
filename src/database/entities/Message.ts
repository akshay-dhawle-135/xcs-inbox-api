import { Entity, Index, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Conversation } from './Conversation';
import { MessageDirection, MessageSource } from '../../constants/enums';
import { Contact } from './Contact';
import { DeliveryStatus } from './DeliveryStatus';

@Entity('messages')
@Index('idx_messages_id', ['id'])
@Index('idx_messages_conversation_id', ['conversation_id'])
@Index('idx_messages_sender_contact_id', ['sender_contact_id'])
@Index('idx_messages_updated_at', ['updated_at'])
@Index('idx_messages_conversation_id_created_at', ['conversation_id', 'created_at'])
export class Message extends BaseEntity {
  @Column({ type: 'uuid' })
  conversation_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provider_message_id?: string;

  @Column({ type: 'uuid' })
  sender_contact_id: string;

  @Column({ type: 'text' })
  message_body: string;

  @Column({
    type: 'enum',
    enum: MessageDirection,
  })
  direction: string;

  @Column({ type: 'uuid', nullable: true })
  replied_to_message_id?: string;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'replied_to_message_id' })
  replied_to_message?: Message;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: object;

  @Column({
    type: 'enum',
    enum: MessageSource,
  })
  message_source: string;

  @Column({ type: 'timestamp', nullable: true })
  read_at?: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.id, { nullable: false })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => Contact, (contact) => contact.id, { nullable: false })
  @JoinColumn({ name: 'sender_contact_id' })
  contact: Contact;

  @OneToMany(() => DeliveryStatus, (deliveryStatus) => deliveryStatus.message)
  deliveryStatuses: DeliveryStatus[];
}
