export enum MessageType {
  SMS = 'sms',
  MMS = 'mms',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  CHAT = 'chat',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  RECEIVED = 'received',
  MESSAGE_CREATED = 'message-created',
  FAILED = 'failed',
  QUEUED = 'queued',
}

export enum Channel {
  SMS = 'sms',
  MMS = 'mms',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  CHAT = 'chat',
}

export enum ContentType {
  TEXT = 'text',
  HTML = 'html',
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum ContactSource {
  INTERNAL = 'internal',
  BRANDBOT = 'brandbot',
}

export enum MessageDirection {
  OUTBOUND = 'outbound',
  INBOUND = 'inbound',
}

export enum MessageSource {
  SYSTEM = 'system',
  USER = 'user',
}

export enum IsPrimary {
  TRUE = 'true',
  FALSE = 'false',
}

export enum ConversationType {
  CHAT = 'chat',
  SMS = 'sms',
  MMS = 'mms',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
}

export enum ConversationStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}
