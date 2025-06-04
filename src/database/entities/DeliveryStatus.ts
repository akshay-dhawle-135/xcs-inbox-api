import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Message } from './Message';
import { MessageStatus } from '../../constants/enums';

@Entity('delivery_statuses')
@Index('idx_delivery_statuses_id', ['id'])
@Index('idx_delivery_statuses_message_id', ['message_id'])
@Index('idx_delivery_statuses_updated_at', ['updated_at'])
@Index('idx_delivery_statuses_message_id_updated_at', ['message_id', 'updated_at'])
export class DeliveryStatus extends BaseEntity {
  @Column('uuid', { name: 'message_id' })
  message_id: string;

  @Column({
    type: 'enum',
    enum: MessageStatus,
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Message, (message) => message.id, { nullable: false })
  @JoinColumn({ name: 'message_id' })
  message: Message;
}
