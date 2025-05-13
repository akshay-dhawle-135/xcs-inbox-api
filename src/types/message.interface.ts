import { ContentType, MessageStatus, MessageType, Channel } from '../constants/enums';

export interface BaseMessageEvent {
  message_type: MessageType;
  message_status: MessageStatus;
  message_id: string;
  to: string;
  from: string;
  channel: Channel;
  content_type: ContentType;
  account_id: string;
}

export interface MessageSentEvent extends BaseMessageEvent {
  message_status: MessageStatus.SENT;
  subject?: string;
  body: string;
  media_url?: string;
}

export interface MessageCreatedEvent extends BaseMessageEvent {
  message_status: MessageStatus.MESSAGE_CREATED;
  subject?: string;
  body: string;
  media_url?: string;
}

export interface MessageDeliveryEvent extends BaseMessageEvent {
  message_status: MessageStatus.DELIVERED;
  delivery_datetime?: string; // ISO 8601 DateTime when the message was delivered (optional)
  provider_message_id?: string; // Provider-specific message ID (optional)
}

export interface MessageReceivedEvent extends BaseMessageEvent {
  message_status: MessageStatus.RECEIVED;
  body: string;
  provider_message_id?: string; // Provider-specific message ID (optional)
}
