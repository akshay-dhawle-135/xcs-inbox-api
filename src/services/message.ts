import { Message } from '../database/entities/Message';
import { ICreateMessageBody } from '../dtos/message/message';
import { buildEntity, save } from './base';
import { findContactById } from './contacts';
import { findConversationById } from './conversation';

export const databaseValidations = async (data: { conversationId: string; contactId: string }) => {
  await findConversationById(data.conversationId);
  await findContactById(data.contactId);
};

export const saveMessage = async (data: ICreateMessageBody): Promise<Message> => {
  const messageInstance = buildEntity(Message, data);
  return save(Message, messageInstance);
};
