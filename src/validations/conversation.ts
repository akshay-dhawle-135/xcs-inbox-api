import { z } from 'zod';
import { ConversationStatus, ConversationType } from '../constants/enums';
import { paginationSchema } from './common';

export const addConversationBodySchema = z
  .object({
    conversation_name: z.string().min(1),
    conversation_type: z.nativeEnum(ConversationType),
    description: z.string().optional(),
    account_id: z.string().min(1),
    last_message_id: z.string().optional(),
    status: z.nativeEnum(ConversationStatus).default(ConversationStatus.OPEN),
  })
  .strict();

export const addConversationPathSchema = z.object({
  conversationId: z.string().uuid(),
});

export const getConversationsQuerySchema = paginationSchema;
