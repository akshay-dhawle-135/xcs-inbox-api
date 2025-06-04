import { z } from 'zod';
import { MessageDirection, MessageSource } from '../constants/enums';
import { paginationSchema } from './common';

export const addMessageBodySchema = z.object({
  sender_contact_id: z.string().uuid(),
  message_body: z.string().min(1),
  direction: z.nativeEnum(MessageDirection),
  message_source: z.nativeEnum(MessageSource),
  provider_message_id: z.string().optional(),
  replied_to_message_id: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const addMessagePathSchema = z.object({
  conversationId: z.string().uuid(),
});

export const getConversationsMessagesPathSchema = z.object({
  conversationId: z.string().uuid(),
});

export const getConversationsMessagesQuerySchema = paginationSchema;
