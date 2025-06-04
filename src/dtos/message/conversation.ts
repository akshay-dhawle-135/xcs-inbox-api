import { z } from 'zod';
import {
  addConversationBodySchema,
  addConversationPathSchema,
  getConversationsQuerySchema,
} from '../../validations/conversation';

export type ICreateConversationBody = z.infer<typeof addConversationBodySchema>;

export type IGetConversationQuery = z.infer<typeof getConversationsQuerySchema>;

export type IGetConversationPath = z.infer<typeof addConversationPathSchema>;
