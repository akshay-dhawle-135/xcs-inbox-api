import { z } from 'zod';
import {
  addMessageBodySchema,
  addMessagePathSchema,
  getConversationsMessagesPathSchema,
  getConversationsMessagesQuerySchema,
} from '../../validations/message';

export type ICreateMessageBody = z.infer<typeof addMessageBodySchema>;

export type ICreateMessagePath = z.infer<typeof addMessagePathSchema>;

export type IGetMessagesPath = z.infer<typeof getConversationsMessagesPathSchema>;

export type IGetMessagesQuery = z.infer<typeof getConversationsMessagesQuerySchema>;
