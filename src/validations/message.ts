import { z } from 'zod';
import { MessageType } from '../constants/enums';

export const addMessageBodySchema = z.object({
  sender_contact_id: z.string().uuid(),
  message_body: z.string().min(1),
  message_type: z.nativeEnum(MessageType),
});

export const addMessagePathSchema = z.object({
  conversationId: z.string().uuid(),
});

export const getConversationsMessagesPathSchema = z.object({
  conversationId: z.string().uuid(),
});

export const getConversationsMessagesQuerySchema = z.object({
  limit: z.number().int().min(1).optional(),
  offset: z.number().int().min(1).optional(),
});
