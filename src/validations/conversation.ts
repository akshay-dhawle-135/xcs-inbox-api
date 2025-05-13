import { z } from 'zod';
import { MessageType } from '../constants/enums';

export const addConversationBodySchema = z.object({
  conversation_name: z.string().min(1),
  conversation_type: z.nativeEnum(MessageType),
  description: z.string().optional(),
  account_id: z.string().min(1),
});

export const getConversationsQuerySchema = z.object({
  limit: z.number().int().min(1).optional(),
  offset: z.number().int().min(1).optional(),
});
